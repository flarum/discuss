<?php

/*
 * This file is part of Flarum.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Flarum\Discuss\Api\Controller;

use Flarum\Discuss\Home\HomeImage;

class DeleteHomeImageDarkController extends DeleteHomeImageController
{
    protected string $pathSettingKey = HomeImage::DARK_PATH_SETTING;
    protected string $sizeSettingKey = HomeImage::DARK_SIZE_SETTING;
}
