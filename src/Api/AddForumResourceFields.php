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
use Flarum\Discuss\Launch\LaunchPhase;
use Flarum\Discussion\Discussion;
use Flarum\Extension\ExtensionManager;
use Flarum\Group\Group;
use Flarum\Post\CommentPost;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use Illuminate\Contracts\Cache\Store;

class AddForumResourceFields
{
    const SUPPORTERS_CACHE_KEY = 'flarum-discuss.total-supporters';
    const COMMUNITY_STATS_CACHE_KEY = 'flarum-discuss.community-stats';

    public function __construct(
        protected Store $cache,
        protected SettingsRepositoryInterface $settings,
        protected ExtensionManager $extensions,
        protected LaunchPhase $launchPhase
    ) {
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

            // The homepage launch banner recomputes the phase from these timestamps,
            // so an open tab flips at launch, unless `fixed` (an admin override) pins it.
            Schema\Arr::make('discussLaunch')
                ->get(fn (mixed $model, Context $context) => [
                    'phase' => $this->launchPhase->current($context->request),
                    'fixed' => $this->launchPhase->isFixed($context->request),
                    'launchAt' => LaunchPhase::LAUNCH_AT,
                    'endsAt' => LaunchPhase::ENDS_AT,
                    'links' => [
                        'event' => $this->settings->get('flarum-discuss.launch.event-url') ?: null,
                        'announcement' => $this->settings->get('flarum-discuss.launch.announcement-url') ?: null,
                        'infographic' => $this->settings->get('flarum-discuss.launch.infographic-url') ?: null,
                        'wallpapers' => $this->settings->get('flarum-discuss.launch.wallpapers-url') ?: null,
                    ],
                ]),
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
