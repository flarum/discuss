<?php

/*
 * This file is part of Flarum.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Flarum\Discuss\Content;

use Flarum\Frontend\Document;
use Flarum\Http\UrlGenerator;
use Flarum\Locale\TranslatorInterface;
use Flarum\Settings\SettingsRepositoryInterface;
use Psr\Http\Message\ServerRequestInterface as Request;

class Home
{
    public function __construct(
        protected TranslatorInterface $translator,
        protected UrlGenerator $url,
        protected SettingsRepositoryInterface $settings
    ) {
    }

    public function __invoke(Document $document, Request $request): Document
    {
        $document->title = $this->translator->trans('flarum-discuss.forum.home.meta_title');
        $document->meta['description'] = $this->translator->trans('flarum-discuss.forum.home.description');

        // When set as the forum's home page, '/' and '/home' serve the same content.
        $document->canonicalUrl = $this->settings->get('default_route') === '/home'
            ? $this->url->to('forum')->base()
            : $this->url->to('forum')->route('home');

        return $document;
    }
}
