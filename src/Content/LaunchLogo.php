<?php

/*
 * This file is part of Flarum.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Flarum\Discuss\Content;

use Flarum\Discuss\Launch\LaunchAssets;
use Flarum\Discuss\Launch\LaunchPhase;
use Flarum\Frontend\Document;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * Shows the FLARUM 2.0 lockup in the forum header during launch week.
 *
 * Only this page's copy of the forum document is changed: the logo_path
 * setting (which emails use) and the API's logoUrl (which the admin upload
 * preview uses) are left alone. The lockup reads on light and dark headers,
 * so the dark-mode logo is dropped rather than swapped.
 */
class LaunchLogo
{
    public function __construct(
        protected LaunchPhase $phase,
        protected LaunchAssets $assets
    ) {
    }

    public function __invoke(Document $document, Request $request): void
    {
        if ($this->phase->current($request) !== LaunchPhase::LAUNCH) {
            return;
        }

        $forum = $document->getForumApiDocument();
        $forum['data']['attributes']['logoUrl'] = $this->assets->url('flarum-2.0-lockup.png');
        $forum['data']['attributes']['logoDarkModeUrl'] = null;

        $document->setForumApiDocument($forum);
    }
}
