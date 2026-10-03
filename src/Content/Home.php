<?php

/*
 * This file is part of Flarum.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Flarum\Discuss\Content;

use Flarum\Discuss\Home\HomeFeed;
use Flarum\Discuss\Launch\LaunchPhase;
use Flarum\Frontend\Document;
use Flarum\Http\UrlGenerator;
use Flarum\Locale\TranslatorInterface;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\View\Factory;
use Psr\Http\Message\ServerRequestInterface as Request;

class Home
{
    public const DOCS_URL = 'https://docs.flarum.org';

    public function __construct(
        protected HomeFeed $feed,
        protected LaunchPhase $launchPhase,
        protected Factory $view,
        protected TranslatorInterface $translator,
        protected UrlGenerator $url,
        protected SettingsRepositoryInterface $settings
    ) {
    }

    public function __invoke(Document $document, Request $request): Document
    {
        // No page title: the homepage is titled with the bare forum name.
        $document->meta['description'] = $this->translator->trans('flarum-discuss.forum.home.description');

        // When set as the forum's home page, '/' and '/home' serve the same content.
        $document->canonicalUrl = $this->settings->get('default_route') === '/home'
            ? $this->url->to('forum')->base()
            : $this->url->to('forum')->route('home');

        $documents = $this->feed->documents($request);

        // Served to the frontend in place of its own first-load requests.
        $document->payload['discussHome'] = $documents;

        // What crawlers and no-JS clients see.
        $document->content = $this->view->make('flarum-discuss::home', [
            'blog' => HomeFeed::blogPosts($documents),
            'extensions' => $documents['extensions']['data'] ?? [],
            'latest' => isset($documents['latest']) ? HomeFeed::latestDiscussions($documents['latest']) : [],
            'solved' => $documents['solved']['data'] ?? [],
            'blogTag' => HomeFeed::BLOG_TAG,
            'extensionsTag' => HomeFeed::EXTENSIONS_TAG,
            'supportTag' => HomeFeed::SUPPORT_TAG,
            'docsUrl' => self::DOCS_URL,
            'launchPhase' => $this->launchPhase->current($request),
            'launchLinks' => [
                'announcement' => $this->settings->get('flarum-discuss.launch.announcement-url') ?: null,
                'infographic' => $this->settings->get('flarum-discuss.launch.infographic-url') ?: null,
                'wallpapers' => $this->settings->get('flarum-discuss.launch.wallpapers-url') ?: null,
            ],
        ]);

        return $document;
    }
}
