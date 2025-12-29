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
use Psr\Http\Message\ServerRequestInterface as Request;

class Contribute
{
    public function __construct(
        protected TranslatorInterface $translator,
        protected UrlGenerator $url
    ) {
    }

    public function __invoke(Document $document, Request $request): Document
    {
        // Set page metadata
        $document->title = $this->translator->trans('flarum-discuss.forum.contribute.meta_title');
        $document->meta['description'] = $this->translator->trans('flarum-discuss.forum.contribute.description');

        // Set canonical URL
        $document->canonicalUrl = $this->url->to('forum')->route('contribute');

        return $document;
    }
}
