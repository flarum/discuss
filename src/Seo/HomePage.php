<?php

/*
 * This file is part of Flarum.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Flarum\Discuss\Seo;

use Flarum\Locale\TranslatorInterface;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Seo\Page\PageDriverInterface;
use FoF\Seo\SeoProperties;
use Psr\Http\Message\ServerRequestInterface;

/**
 * fof/seo metadata for the community homepage. Also claims the `default`
 * route when the homepage is the forum home, running after fof/seo's index
 * driver (this extension loads after it) so the homepage's own description
 * and root canonical win over the discussion-list defaults.
 */
class HomePage implements PageDriverInterface
{
    public function __construct(
        protected SettingsRepositoryInterface $settings,
        protected TranslatorInterface $translator
    ) {
    }

    public function extensionDependencies(): array
    {
        return [];
    }

    public function handleRoutes(): array
    {
        return ['home', 'default'];
    }

    public function handle(ServerRequestInterface $request, SeoProperties $properties): void
    {
        if ($request->getAttribute('routeName') === 'default' && $this->settings->get('default_route') !== '/home') {
            return;
        }

        // The page title stays the bare forum name; only og/twitter titles are set.
        $properties->setTitle($this->settings->get('forum_title'), false);
        $properties->setDescription($this->translator->trans('flarum-discuss.forum.home.description'));
        $properties->setUrl('');
        $properties->setCanonicalUrl('');
    }
}
