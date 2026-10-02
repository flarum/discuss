<?php

/*
 * This file is part of Flarum.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Flarum\Discuss\Listeners;

use Flarum\Discuss\Api\AddForumResourceFields;
use Flarum\Extension\Event\Disabled;
use Flarum\Extension\Event\Enabled;
use Illuminate\Contracts\Cache\Store;

/**
 * Which stats exist depends on which optional extensions are enabled (e.g.
 * questionsSolved needs fof/best-answer), so toggling one invalidates the cache.
 */
class ClearCommunityStatsCache
{
    public function __construct(
        protected Store $cache
    ) {
    }

    public function handle(Enabled|Disabled $event): void
    {
        $this->cache->forget(AddForumResourceFields::COMMUNITY_STATS_CACHE_KEY);
    }
}
