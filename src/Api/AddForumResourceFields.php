<?php

/*
 * This file is part of Flarum.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Flarum\Discuss\Api;

use Carbon\Carbon;
use Flarum\Api\Context;
use Flarum\Api\Schema;
use Flarum\Discuss\Home\HomeImage;
use Flarum\Discussion\Discussion;
use Flarum\Extension\ExtensionManager;
use Flarum\Group\Group;
use Flarum\Post\CommentPost;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use Illuminate\Contracts\Cache\Store;
use Illuminate\Contracts\Filesystem\Cloud;
use Illuminate\Contracts\Filesystem\Factory;

class AddForumResourceFields
{
    const SUPPORTERS_CACHE_KEY = 'flarum-discuss.total-supporters';
    const COMMUNITY_STATS_CACHE_KEY = 'flarum-discuss.community-stats';

    protected Cloud $assets;

    public function __construct(
        protected Store $cache,
        protected SettingsRepositoryInterface $settings,
        protected ExtensionManager $extensions,
        Factory $filesystem
    ) {
        $this->assets = $filesystem->disk('flarum-assets');
    }

    public function __invoke(): array
    {
        return [
            Schema\Integer::make('totalSupporters')
                ->get(function (mixed $model, Context $context) {
                    // Check if the value is cached
                    $cached = $this->cache->get(self::SUPPORTERS_CACHE_KEY);
                    if ($cached !== null) {
                        return $cached;
                    }

                    // Otherwise, compute the value and cache it for 12 hours
                    $monthlyGroupId = $this->settings->get('flarum-discuss.supporters.monthly-group');
                    $oneTimeGroupId = $this->settings->get('flarum-discuss.supporters.one-time-group');

                    $groupIds = array_filter([$monthlyGroupId, $oneTimeGroupId]);

                    $count = 0;
                    if (! empty($groupIds)) {
                        $count = Group::whereIn('id', $groupIds)
                            ->get()
                            ->sum(fn (Group $group) => $group->users()->count());
                    }

                    $this->cache->put(self::SUPPORTERS_CACHE_KEY, $count, 60 * 60 * 12);

                    return $count;
                }),

            // Aggregate counts only, so one cached copy is safe to share across actors.
            Schema\Arr::make('communityStats')
                ->get(function () {
                    $cached = $this->cache->get(self::COMMUNITY_STATS_CACHE_KEY);
                    if ($cached !== null) {
                        return $cached;
                    }

                    $stats = $this->computeCommunityStats();

                    $this->cache->put(self::COMMUNITY_STATS_CACHE_KEY, $stats, 60 * 5);

                    return $stats;
                }),

            // Null when no image is uploaded, so the homepage renders nothing.
            Schema\Arr::make('discussHomeImage')
                ->nullable()
                ->get(fn () => $this->homeImage()),
        ];
    }

    /**
     * Both variants as uploaded; the frontend falls back from one to the other.
     *
     * @return array{light: array<string, mixed>|null, dark: array<string, mixed>|null, link: string|null, alt: string}|null
     */
    protected function homeImage(): ?array
    {
        $light = $this->uploadedImage(HomeImage::PATH_SETTING, HomeImage::SIZE_SETTING);
        $dark = $this->uploadedImage(HomeImage::DARK_PATH_SETTING, HomeImage::DARK_SIZE_SETTING);

        if (! $light && ! $dark) {
            return null;
        }

        return [
            'light' => $light,
            'dark' => $dark,
            'link' => $this->settings->get(HomeImage::LINK_SETTING) ?: null,
            'alt' => (string) $this->settings->get(HomeImage::ALT_SETTING),
        ];
    }

    /**
     * @return array{url: string, width: int|null, height: int|null}|null
     */
    protected function uploadedImage(string $pathSetting, string $sizeSetting): ?array
    {
        $path = $this->settings->get($pathSetting);

        if (! $path) {
            return null;
        }

        [$width, $height] = array_map('intval', explode('x', (string) $this->settings->get($sizeSetting)) + [1 => 0]);

        return [
            'url' => $this->assets->url($path),
            'width' => $width ?: null,
            'height' => $height ?: null,
        ];
    }

    /**
     * @return array<string, int|null>
     */
    protected function computeCommunityStats(): array
    {
        $now = Carbon::now();

        $discussions = Discussion::query()->whereNull('hidden_at')->where('is_private', false);

        return [
            'members' => User::query()->where('is_email_confirmed', true)->count(),
            'discussions' => (clone $discussions)->count(),
            'posts' => CommentPost::query()->whereNull('hidden_at')->where('is_private', false)->count(),
            'postsToday' => CommentPost::query()->whereNull('hidden_at')->where('is_private', false)->where('created_at', '>=', $now->copy()->subDay())->count(),
            'newMembersWeek' => User::query()->where('is_email_confirmed', true)->where('joined_at', '>=', $now->copy()->subWeek())->count(),
            'questionsSolved' => $this->extensions->isEnabled('fof-best-answer')
                ? (clone $discussions)->whereNotNull('best_answer_post_id')->count()
                : null,
        ];
    }
}
