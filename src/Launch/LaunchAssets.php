<?php

/*
 * This file is part of Flarum.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Flarum\Discuss\Launch;

use Illuminate\Contracts\Filesystem\Cloud;
use Illuminate\Contracts\Filesystem\Factory;

/**
 * URLs for the launch artwork published from this extension's assets/launch/.
 */
class LaunchAssets
{
    protected Cloud $assets;

    public function __construct(Factory $filesystem)
    {
        $this->assets = $filesystem->disk('flarum-assets');
    }

    public function url(string $file): string
    {
        return $this->assets->url('extensions/flarum-discuss/launch/'.$file);
    }

    public function shareImage(string $phase): string
    {
        return $this->url($phase === LaunchPhase::TEASER ? 'teaser-1200x630.png' : 'share-1200x630.png');
    }
}
