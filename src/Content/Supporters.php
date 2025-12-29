<?php

/*
 * This file is part of Flarum.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Flarum\Discuss\Content;

use Flarum\Api\Client;
use Flarum\Frontend\Document;
use Flarum\Http\UrlGenerator;
use Flarum\Locale\TranslatorInterface;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\View\Factory;
use Psr\Http\Message\ServerRequestInterface as Request;

class Supporters
{
    public function __construct(
        protected Client $api,
        protected Factory $view,
        protected TranslatorInterface $translator,
        protected UrlGenerator $url,
        protected SettingsRepositoryInterface $settings
    ) {
    }

    public function __invoke(Document $document, Request $request): Document
    {
        // Set page metadata
        $document->title = $this->translator->trans('flarum-discuss.forum.supporters.meta_title');
        $document->meta['description'] = $this->translator->trans('flarum-discuss.forum.supporters.description');

        // Set canonical URL
        $document->canonicalUrl = $this->url->to('forum')->route('supporters');

        return $document;
    }
}
