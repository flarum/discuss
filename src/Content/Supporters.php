<?php

/*
 * This file is part of flarum/discuss.
 *
 * Copyright (c) 2025 IanM.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace Flarum\Discuss\Content;

use Flarum\Api\Client;
use Flarum\Frontend\Document;
use Flarum\Http\UrlGenerator;
use Flarum\Locale\TranslatorInterface;
use Illuminate\Contracts\View\Factory;
use Psr\Http\Message\ServerRequestInterface as Request;

class Supporters
{
    public function __construct(
        protected Client $api,
        protected Factory $view,
        protected TranslatorInterface $translator,
        protected UrlGenerator $url
    ) {
    }

    public function __invoke(Document $document, Request $request): Document
    {
        // Optional: Load data from API
        // $apiDocument = $this->getApiDocument($request);
        // $document->payload['apiDocument'] = $apiDocument;

        // Set page metadata
        $document->title = $this->translator->trans('flarum-discuss.forum.supporters.meta_title');
        $document->meta['description'] = $this->translator->trans('flarum-discuss.forum.supporters.description');

        // Set canonical URL
        $document->canonicalUrl = $this->url->to('forum')->route('supporters');

        // Optional: Set server-rendered content (for SEO)
        // $document->content = $this->view->make('flarum-discuss::supporters', compact('data'));

        return $document;
    }

    /**
     * Optional: Get data from API endpoint
     *
     * protected function getApiDocument(Request $request): object
     * {
     *     return json_decode(
     *         $this->api
     *             ->withoutErrorHandling()
     *             ->withParentRequest($request)
     *             ->get('/your-api-endpoint')
     *             ->getBody(),
     *         false
     *     );
     * }
     */
}
