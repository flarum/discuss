<?php

/*
 * This file is part of Flarum.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Flarum\Discuss\Content;

use Flarum\Frontend\Document;
use Illuminate\Contracts\Filesystem\Cloud;
use Illuminate\Contracts\Filesystem\Factory;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * Site icons from the 2026 design system's `on-gradient` set.
 *
 * The web manifest and its Android icons are left to fof/pwa, which serves its own `/webmanifest`.
 */
class SiteIcons
{
    protected Cloud $assets;

    public function __construct(Factory $filesystem)
    {
        $this->assets = $filesystem->disk('flarum-assets');
    }

    public function __invoke(Document $document, Request $request): void
    {
        // Replaces the single admin-uploaded favicon that core's Meta content stores under this key.
        $document->head['favicon'] = implode("\n", [
            '<link rel="icon" href="'.$this->url('favicon.ico').'" sizes="48x48">',
            '<link rel="icon" href="'.$this->url('favicon.svg').'" type="image/svg+xml">',
            '<link rel="icon" type="image/png" sizes="32x32" href="'.$this->url('favicon-32x32.png').'">',
            '<link rel="icon" type="image/png" sizes="16x16" href="'.$this->url('favicon-16x16.png').'">',
        ]);

        $document->head['apple-touch-icon'] = '<link rel="apple-touch-icon" sizes="180x180" href="'.$this->url('apple-touch-icon.png').'">';
        $document->head['mask-icon'] = '<link rel="mask-icon" href="'.$this->url('safari-pinned-tab.svg').'" color="#E7562E">';
    }

    protected function url(string $file): string
    {
        return e($this->assets->url('extensions/flarum-discuss/icons/'.$file));
    }
}
