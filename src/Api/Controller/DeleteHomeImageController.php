<?php

/*
 * This file is part of Flarum.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Flarum\Discuss\Api\Controller;

use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\Discuss\Home\HomeImage;
use Flarum\Http\RequestUtil;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Filesystem\Factory;
use Illuminate\Contracts\Filesystem\Filesystem;
use Psr\Http\Message\ServerRequestInterface;

class DeleteHomeImageController extends AbstractDeleteController
{
    protected string $pathSettingKey = HomeImage::PATH_SETTING;
    protected string $sizeSettingKey = HomeImage::SIZE_SETTING;
    protected Filesystem $uploadDir;

    public function __construct(
        protected SettingsRepositoryInterface $settings,
        Factory $filesystemFactory
    ) {
        $this->uploadDir = $filesystemFactory->disk('flarum-assets');
    }

    protected function delete(ServerRequestInterface $request): void
    {
        RequestUtil::getActor($request)->assertAdmin();

        $path = $this->settings->get($this->pathSettingKey);

        $this->settings->set($this->pathSettingKey, null);
        $this->settings->set($this->sizeSettingKey, null);

        if ($path && $this->uploadDir->exists($path)) {
            $this->uploadDir->delete($path);
        }
    }
}
