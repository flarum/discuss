<?php

/*
 * This file is part of Flarum.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Flarum\Discuss\Api\Controller;

use Flarum\Discuss\Home\HomeImage;

/**
 * The dark-mode variant of the homepage banner; same processing as the light one.
 */
class UploadHomeImageDarkController extends UploadHomeImageController
{
    protected string $filePathSettingKey = HomeImage::DARK_PATH_SETTING;
    protected string $filenamePrefix = HomeImage::DARK_UPLOAD_NAME;
    protected string $sizeSettingKey = HomeImage::DARK_SIZE_SETTING;
}
