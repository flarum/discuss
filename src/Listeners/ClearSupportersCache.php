<?php

namespace Flarum\Discuss\Listeners;

use Flarum\Discuss\Api\AddForumResourceFields;
use FoF\GitHubSponsors\Event\SponsorAdded;
use FoF\GitHubSponsors\Event\SponsorRemoved;
use FoF\OpenCollective\Event\BackerAdded;
use FoF\OpenCollective\Event\BackerRemoved;
use Illuminate\Contracts\Cache\Store;
use Illuminate\Contracts\Events\Dispatcher;

class ClearSupportersCache
{
    public function __construct(
        protected Store $cache
    ) {
    }
    
    public function subscribe(Dispatcher $events): void
    {
        $events->listen([BackerAdded::class, BackerRemoved::class, SponsorAdded::class, SponsorRemoved::class], [$this, 'clearCache']);
    }
    
    public function clearCache(BackerAdded|BackerRemoved|SponsorAdded|SponsorRemoved $event): void
    {
        $this->cache->forget(AddForumResourceFields::SUPPORTERS_CACHE_KEY);
    }
}
