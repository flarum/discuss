<?php

/*
 * This file is part of Flarum.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Flarum\Discuss\Api;

use Flarum\Api\Context;
use Flarum\Api\Schema;
use Flarum\Group\Group;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Cache\Store;

class AddForumResourceFields
{
    const SUPPORTERS_CACHE_KEY = 'flarum-discuss.total-supporters';

    public function __construct(
        protected Store $cache,
        protected SettingsRepositoryInterface $settings
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
        ];
    }
}
