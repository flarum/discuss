<?php

/*
 * This file is part of Flarum.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Flarum\Discuss\Launch;

use Carbon\Carbon;
use Carbon\CarbonImmutable;
use Flarum\Http\RequestUtil;
use Flarum\Settings\SettingsRepositoryInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * The Flarum 2.0 launch period, which drives the time-boxed swaps (banner,
 * share image, touch icon, header logo). Everything is inert after ENDS_AT,
 * so the launch code can be removed at leisure.
 */
class LaunchPhase
{
    public const TEASER = 'teaser';
    public const LAUNCH = 'launch';

    // 9 Oct 2026 19:00 BST, the Discord stage event, and one week later.
    public const LAUNCH_AT = '2026-10-09T18:00:00+00:00';
    public const ENDS_AT = '2026-10-16T18:00:00+00:00';

    // auto (follow the clock), teaser, launch or off.
    public const FORCE_SETTING = 'flarum-discuss.launch.force-phase';

    // Lets an admin preview a phase for their own requests only, e.g. /?launch-preview=launch.
    public const PREVIEW_PARAM = 'launch-preview';

    public function __construct(
        protected SettingsRepositoryInterface $settings
    ) {
    }

    /**
     * The phase for this request: an admin's preview, else the forced setting, else the clock.
     */
    public function current(?ServerRequestInterface $request = null): ?string
    {
        $override = $this->override($request);

        return $override !== null ? $this->fromOverride($override) : self::byClock(Carbon::now());
    }

    /**
     * Whether the phase is pinned by an override rather than following the
     * clock, in which case the frontend must not recompute it.
     */
    public function isFixed(?ServerRequestInterface $request = null): bool
    {
        return $this->override($request) !== null;
    }

    public static function byClock(\DateTimeInterface $now): ?string
    {
        if ($now < CarbonImmutable::parse(self::LAUNCH_AT)) {
            return self::TEASER;
        }

        return $now < CarbonImmutable::parse(self::ENDS_AT) ? self::LAUNCH : null;
    }

    /**
     * 'teaser', 'launch' or 'off' when overridden; null when following the clock.
     */
    protected function override(?ServerRequestInterface $request): ?string
    {
        $preview = $request?->getQueryParams()[self::PREVIEW_PARAM] ?? null;

        if (is_string($preview) && $this->isOverride($preview) && RequestUtil::getActor($request)->isAdmin()) {
            return $preview;
        }

        $forced = (string) $this->settings->get(self::FORCE_SETTING, 'auto');

        return $this->isOverride($forced) ? $forced : null;
    }

    protected function isOverride(string $value): bool
    {
        return in_array($value, [self::TEASER, self::LAUNCH, 'off'], true);
    }

    protected function fromOverride(string $override): ?string
    {
        return $override === 'off' ? null : $override;
    }
}
