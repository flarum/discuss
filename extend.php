<?php

/*
 * This file is part of Flarum.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Flarum\Discuss;

use Flarum\Api\Resource\DiscussionResource;
use Flarum\Api\Resource\ForumResource;
use Flarum\Api\Sort\SortColumn;
use Flarum\Discuss\Console\UpdateStatsCommand;
use Flarum\Extend;
use Flarum\Extension\Event as ExtensionEvent;
use Illuminate\Console\Scheduling\Event;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/forum.less')
        ->jsDirectory(__DIR__.'/js/dist/forum')
        ->route('/home', 'home', Content\Home::class)
        ->route('/supporters', 'supporters', Content\Supporters::class)
        ->route('/contribute', 'contribute', Content\Contribute::class),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/less/admin.less'),

    new Extend\Locales(__DIR__.'/locale'),

    (new Extend\Settings())
        ->default('flarum-discuss.donation-link.github', 'https://github.com/sponsors/flarum')
        ->default('flarum-discuss.donation-link.opencollective', 'https://opencollective.com/flarum#category-CONTRIBUTE')
        ->default('flarum-discuss.supporters.github-stars', 6700)
        ->default('flarum-discuss.supporters.framework-commits', 9300)
        ->default('flarum-discuss.supporters.framework-contributors', 200)
        ->serializeToForum('githubSponsorsUrl', 'flarum-discuss.donation-link.github')
        ->serializeToForum('openCollectiveUrl', 'flarum-discuss.donation-link.opencollective')
        ->serializeToForum('monthlySupportersGroupId', 'flarum-discuss.supporters.monthly-group')
        ->serializeToForum('oneTimeSupportersGroupId', 'flarum-discuss.supporters.one-time-group')
        ->serializeToForum('teamGroupId', 'flarum-discuss.home.team-group')
        ->serializeToForum('githubStars', 'flarum-discuss.supporters.github-stars', 'intval')
        ->serializeToForum('frameworkCommits', 'flarum-discuss.supporters.framework-commits', 'intval')
        ->serializeToForum('frameworkContributors', 'flarum-discuss.supporters.framework-contributors', 'intval'),

    (new Extend\Console())
        ->command(UpdateStatsCommand::class)
        ->schedule(UpdateStatsCommand::class, function (Event $event) {
            $event->twiceDaily();
        }),

    (new Extend\ApiResource(ForumResource::class))
        ->fields(Api\AddForumResourceFields::class),

    (new Extend\Conditional())
        ->whenExtensionEnabled('fof-seo', fn () => [
            (new \FoF\Seo\Extend\SEO())
                ->addExtender('discuss_home', Seo\HomePage::class),
        ])
        ->whenExtensionEnabled('fof-best-answer', fn () => [
            // Lets the homepage list support questions by when they were solved, not last activity.
            (new Extend\ApiResource(DiscussionResource::class))
                ->sorts(fn () => [
                    SortColumn::make('bestAnswerSetAt'),
                ]),
        ]),

    (new Extend\Event())
        ->subscribe(Listeners\ClearSupportersCache::class)
        ->listen(\Flarum\Post\Event\Saving::class, Listeners\BlockBannedLinks::class)
        ->listen(ExtensionEvent\Enabled::class, Listeners\ClearCommunityStatsCache::class)
        ->listen(ExtensionEvent\Disabled::class, Listeners\ClearCommunityStatsCache::class),
];
