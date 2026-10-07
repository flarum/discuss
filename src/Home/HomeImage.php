<?php

/*
 * This file is part of Flarum.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Flarum\Discuss\Home;

/**
 * Settings for the optional image banner on the community homepage. Like the
 * forum logo, there's an optional dark-mode variant; whichever single image
 * is uploaded is used for both themes.
 */
class HomeImage
{
    public const PATH_SETTING = 'flarum-discuss.home.image_path';
    public const SIZE_SETTING = 'flarum-discuss.home.image_size';
    public const LINK_SETTING = 'flarum-discuss.home.image_link';
    public const ALT_SETTING = 'flarum-discuss.home.image_alt';

    public const DARK_PATH_SETTING = 'flarum-discuss.home.image_dark_path';
    public const DARK_SIZE_SETTING = 'flarum-discuss.home.image_dark_size';

    // Form field and API route for core's UploadImageButton.
    public const UPLOAD_NAME = 'discuss-home-image';
    public const DARK_UPLOAD_NAME = 'discuss-home-image-dark';
}
