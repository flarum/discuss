<?php

/*
 * This file is part of Flarum.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Flarum\Discuss\Listeners;

use Flarum\Post\Event\Saving;
use Illuminate\Support\Arr;
use Tobyz\JsonApiServer\Exception\UnprocessableEntityException;

class BlockBannedLinks
{
    protected function blockedDomains(): array
    {
        return [
            // Image hosts
            'imgur.com',
            'gyazo.com',
            'prnt.sc',          // Lightshot
            'screencast.com',
            'postimg.cc',
            'postimages.org',
            'imgbb.com',
            'ibb.co',
            'imgbox.com',
            'imgflip.com',
            'imageshack.com',
            'imageshack.us',
            'photobucket.com',
            'flickr.com',
            'imgpile.com',
            'snipboard.io',
            'monosnap.com',
            'droplr.com',
            'paste.pics',
            'i.redd.it',
            // Animated image / short video hosts
            'giphy.com',
            'tenor.com',
            'gfycat.com',
            'streamable.com',
            // File / media hosts commonly used for images
            'catbox.moe',
            'pomf.cat',
            'uguu.se',
        ];
    }

    public function handle(Saving $event): void
    {
        $content = Arr::get($event->data, 'attributes.content');

        if (! is_string($content) || $content === '') {
            return;
        }

        foreach ($this->blockedDomains() as $domain) {
            if (preg_match('#https?://(?:[^/\s]*\.)?'.preg_quote($domain, '#').'[/\s"\'<>]?#i', $content)) {
                throw new UnprocessableEntityException([[
                    'detail' => "Links to {$domain} are not permitted here. Try uploading directly in the composer instead.",
                    'source' => ['pointer' => '/data/attributes/content'],
                ]]);
            }
        }
    }
}
