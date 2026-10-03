<?php

/*
 * This file is part of Flarum.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Flarum\Discuss\Seo;

use Flarum\Discuss\Launch\LaunchAssets;
use Flarum\Discuss\Launch\LaunchPhase;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Seo\Event\PreparingPageMeta;
use Illuminate\Contracts\Filesystem\Cloud;
use Illuminate\Contracts\Filesystem\Factory;

/**
 * Swaps fof/seo's site-wide default share image for the launch artwork: the
 * teaser until launch, then the launch image for launch week. A page with
 * its own image (a discussion with a picture in its first post, say) keeps it.
 */
class LaunchShareImage
{
    protected Cloud $assets;

    public function __construct(
        protected LaunchPhase $phase,
        protected LaunchAssets $launchAssets,
        protected SettingsRepositoryInterface $settings,
        Factory $filesystem
    ) {
        $this->assets = $filesystem->disk('flarum-assets');
    }

    public function handle(PreparingPageMeta $event): void
    {
        $phase = $this->phase->current($event->request);

        if ($phase === null) {
            return;
        }

        // fof/seo mirrors the image into twitter:image, the only place it can be read back from.
        $current = $event->document->meta['twitter:image'] ?? null;

        if ($current !== null && $current !== $this->siteDefaultImage()) {
            return;
        }

        $event->properties->setImage($this->launchAssets->shareImage($phase));
    }

    /**
     * fof/seo's site-wide image, resolved with its own fallback order.
     */
    protected function siteDefaultImage(): ?string
    {
        foreach (['seo_social_media_image_path', 'logo_path', 'favicon_path'] as $key) {
            $path = $this->settings->get($key);

            if ($path !== null) {
                return $this->assets->url($path);
            }
        }

        return null;
    }
}
