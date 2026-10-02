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
 * fof/seo metadata for the community homepage. fof/seo also routes the forum
 * root here when `/home` is the configured `default_route`.
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
        return ['home'];
    }

    public function handle(ServerRequestInterface $request, SeoProperties $properties): void
    {
        // The page title stays the bare forum name; only og/twitter titles are set.
        $properties->setTitle($this->settings->get('forum_title'), false);
        $properties->setDescription($this->translator->trans('flarum-discuss.forum.home.description'));

        // As the forum home, /home is just an alias of the root.
        $path = $this->settings->get('default_route') === '/home' ? '' : '/home';

        $properties->setUrl($path);
        $properties->setCanonicalUrl($path);
    }
}
