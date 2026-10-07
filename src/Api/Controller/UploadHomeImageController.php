<?php

/*
 * This file is part of Flarum.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Flarum\Discuss\Api\Controller;

use Flarum\Api\Controller\UploadImageController;
use Flarum\Discuss\Home\HomeImage;
use Flarum\Discuss\Home\HomeImageValidator;
use Intervention\Image\Interfaces\EncodedImageInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\UploadedFileInterface;

/**
 * Stores the homepage banner as a single-frame WebP that fits 2400×2400
 * (sharp on 2× screens at the banner's ~1200px width).
 *
 * Lossy WebP halves colour resolution, which visibly softens the hard edges
 * and text in artwork; lossless keeps them, but balloons on photos. So both
 * are encoded and lossless kept when it stays close to the lossy size
 * (measured: brand artwork ~1.9×, a photo ~5.5×).
 */
class UploadHomeImageController extends UploadImageController
{
    protected string $filePathSettingKey = HomeImage::PATH_SETTING;
    protected string $filenamePrefix = HomeImage::UPLOAD_NAME;
    protected ?string $validator = HomeImageValidator::class;
    protected string $sizeSettingKey = HomeImage::SIZE_SETTING;

    private const LOSSLESS_MAX_RATIO = 2.5;
    private const LOSSLESS_MAX_BYTES = 1_500_000;

    private string $dimensions = '';

    protected function makeImage(UploadedFileInterface $file): EncodedImageInterface
    {
        $image = $this->imageManager->read($file->getStream()->getMetadata('uri'));

        if ($image->isAnimated()) {
            $image->removeAnimation();
        }

        $image->scaleDown(width: 2400, height: 2400);

        $this->dimensions = $image->width().'x'.$image->height();

        $lossy = $image->toWebp(quality: 90);
        // Quality 100 is lossless WebP in both the GD and Imagick encoders.
        $lossless = $image->toWebp(quality: 100);

        $keepLossless = $lossless->size() <= $lossy->size() * self::LOSSLESS_MAX_RATIO
            && $lossless->size() <= self::LOSSLESS_MAX_BYTES;

        return $keepLossless ? $lossless : $lossy;
    }

    /**
     * Stored so the banner can reserve its space before the image loads.
     */
    protected function afterStore(ServerRequestInterface $request, UploadedFileInterface $file): void
    {
        $this->settings->set($this->sizeSettingKey, $this->dimensions);
    }
}
