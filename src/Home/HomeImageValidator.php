<?php

/*
 * This file is part of Flarum.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Flarum\Discuss\Home;

use Flarum\Foundation\AbstractImageValidator;

class HomeImageValidator extends AbstractImageValidator
{
    // Banners are often photos, which outgrow core's 2 MB logo limit. The
    // 24-megapixel decode cap from the parent still applies.
    public function getMaxSize(): int
    {
        return 8192;
    }
}
