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
        // Preload supporters data
        $apiDocument = $this->getApiDocument($request);
        if ($apiDocument) {
            $document->payload['apiDocument'] = $apiDocument;
        }

        // Set page metadata
        $document->title = $this->translator->trans('flarum-discuss.forum.supporters.meta_title');
        $document->meta['description'] = $this->translator->trans('flarum-discuss.forum.supporters.description');

        // Set canonical URL
        $document->canonicalUrl = $this->url->to('forum')->route('supporters');

        return $document;
    }

    /**
     * Get supporters data from API endpoint.
     */
    protected function getApiDocument(Request $request): ?object
    {
        $monthlyGroupId = $this->settings->get('flarum-discuss.supporters.monthly-group');
        $oneTimeGroupId = $this->settings->get('flarum-discuss.supporters.one-time-group');

        // Build filter query for both groups
        $filters = [];
        if ($monthlyGroupId) {
            $filters[] = "group:$monthlyGroupId";
        }
        if ($oneTimeGroupId) {
            $filters[] = "group:$oneTimeGroupId";
        }

        if (empty($filters)) {
            return null;
        }

        $query = implode(' OR ', $filters);

        try {
            return json_decode(
                $this->api
                    ->withoutErrorHandling()
                    ->withParentRequest($request)
                    ->get("/users?filter[q]=$query&include=groups")
                    ->getBody(),
                false
            );
        } catch (\Exception) {
            // If API call fails, return null and let the frontend load the data
            return null;
        }
    }
}
