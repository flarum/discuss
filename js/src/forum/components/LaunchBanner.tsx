import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import Icon from 'flarum/common/components/Icon';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';

export type LaunchPhase = 'teaser' | 'launch';

export interface DiscussLaunch {
  phase: LaunchPhase | null;
  fixed: boolean;
  launchAt: string;
  endsAt: string;
  links: Record<'event' | 'announcement' | 'infographic' | 'wallpapers', string | null>;
}

/**
 * The phase as of now. Recomputed from the timestamps (so an open tab flips
 * at launch) unless an admin override pinned it server-side.
 */
export function currentLaunchPhase(launch: DiscussLaunch): LaunchPhase | null {
  if (launch.fixed) return launch.phase;

  const now = Date.now();
  if (now < Date.parse(launch.launchAt)) return 'teaser';

  return now < Date.parse(launch.endsAt) ? 'launch' : null;
}

export interface ILaunchBannerAttrs extends ComponentAttrs {}

/**
 * Flarum 2.0 launch banner for the homepage: a countdown teaser until launch,
 * then links to the announcement and artwork for launch week. Time-boxed; it
 * renders nothing after the launch period.
 */
export default class LaunchBanner extends Component<ILaunchBannerAttrs> {
  view(): Mithril.Children {
    const launch = app.forum.attribute<DiscussLaunch | undefined>('discussLaunch');
    const phase = launch && currentLaunchPhase(launch);

    if (!launch || !phase) return null;

    return (
      <section className={`LaunchBanner LaunchBanner--${phase}`}>
        <div className="LaunchBanner-bubbles" aria-hidden="true" />
        <div className="LaunchBanner-body">{phase === 'teaser' ? this.teaserItems(launch).toArray() : this.launchItems(launch).toArray()}</div>
      </section>
    );
  }

  teaserItems(launch: DiscussLaunch): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const launchAt = new Date(launch.launchAt);

    items.add('kicker', <span className="LaunchBanner-kicker">{app.translator.trans('flarum-discuss.forum.launch.teaser_kicker')}</span>, 100);
    items.add('title', <h2 className="LaunchBanner-title">{app.translator.trans('flarum-discuss.forum.launch.teaser_title')}</h2>, 90);
    items.add('countdown', <LaunchCountdown until={launchAt} />, 80);
    items.add(
      'when',
      <p className="LaunchBanner-when">
        {app.translator.trans('flarum-discuss.forum.launch.teaser_when', { time: dayjs(launchAt).format('LLLL') })}
      </p>,
      70
    );

    if (launch.links.event) {
      items.add(
        'actions',
        <div className="LaunchBanner-actions">
          {this.link(launch.links.event, 'fab fa-discord', app.translator.trans('flarum-discuss.forum.launch.event_button'), true)}
        </div>,
        60
      );
    }

    return items;
  }

  launchItems(launch: DiscussLaunch): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const { announcement, infographic, wallpapers } = launch.links;

    items.add('kicker', <span className="LaunchBanner-kicker">{app.translator.trans('flarum-discuss.forum.launch.launch_kicker')}</span>, 100);
    items.add('title', <h2 className="LaunchBanner-title">{app.translator.trans('flarum-discuss.forum.launch.launch_title')}</h2>, 90);
    items.add('tagline', <p className="LaunchBanner-tagline">{app.translator.trans('flarum-discuss.forum.launch.launch_tagline')}</p>, 80);

    if (announcement || infographic || wallpapers) {
      items.add(
        'actions',
        <div className="LaunchBanner-actions">
          {announcement && this.link(announcement, 'fas fa-bullhorn', app.translator.trans('flarum-discuss.forum.launch.announcement_button'), true)}
          {infographic && this.link(infographic, 'fas fa-image', app.translator.trans('flarum-discuss.forum.launch.infographic_button'))}
          {wallpapers && this.link(wallpapers, 'fas fa-desktop', app.translator.trans('flarum-discuss.forum.launch.wallpapers_button'))}
        </div>,
        70
      );
    }

    return items;
  }

  link(href: string, icon: string, label: Mithril.Children, primary: boolean = false): Mithril.Children {
    return (
      <a className={`Button LaunchBanner-button${primary ? ' LaunchBanner-button--primary' : ''}`} href={href} target="_blank" rel="noopener">
        <Icon name={icon} className="Button-icon" />
        <span className="Button-label">{label}</span>
      </a>
    );
  }
}

interface ILaunchCountdownAttrs extends ComponentAttrs {
  until: Date;
}

/**
 * Days, hours, minutes and seconds to `until`. Ticks by writing its own text
 * nodes (a global m.redraw() every second would re-render the whole page) and
 * redraws once at zero so the banner switches to the launch phase.
 */
class LaunchCountdown extends Component<ILaunchCountdownAttrs> {
  private timer?: number;

  oncreate(vnode: Mithril.VnodeDOM<ILaunchCountdownAttrs, this>) {
    super.oncreate(vnode);

    this.timer = window.setInterval(() => {
      const parts = this.parts();

      if (!parts) {
        window.clearInterval(this.timer);
        m.redraw();
        return;
      }

      vnode.dom.querySelectorAll<HTMLElement>('[data-unit]').forEach((el) => {
        el.textContent = parts[el.dataset.unit as keyof typeof parts];
      });
    }, 1000);
  }

  onremove(vnode: Mithril.VnodeDOM<ILaunchCountdownAttrs, this>) {
    super.onremove(vnode);

    window.clearInterval(this.timer);
  }

  view(): Mithril.Children {
    const parts = this.parts() || { days: '0', hours: '00', minutes: '00', seconds: '00' };
    const labels = {
      days: app.translator.trans('flarum-discuss.forum.launch.countdown_days'),
      hours: app.translator.trans('flarum-discuss.forum.launch.countdown_hours'),
      minutes: app.translator.trans('flarum-discuss.forum.launch.countdown_minutes'),
      seconds: app.translator.trans('flarum-discuss.forum.launch.countdown_seconds'),
    };

    return (
      <div className="LaunchCountdown" role="timer" aria-live="off">
        {(['days', 'hours', 'minutes', 'seconds'] as const).map((unit) => (
          <div className="LaunchCountdown-unit">
            <span className="LaunchCountdown-value" data-unit={unit}>
              {parts[unit]}
            </span>
            <span className="LaunchCountdown-label">{labels[unit]}</span>
          </div>
        ))}
      </div>
    );
  }

  parts(): Record<'days' | 'hours' | 'minutes' | 'seconds', string> | null {
    const remaining = Math.floor((this.attrs.until.getTime() - Date.now()) / 1000);

    if (remaining <= 0) return null;

    const pad = (n: number) => String(n).padStart(2, '0');

    return {
      days: String(Math.floor(remaining / 86400)),
      hours: pad(Math.floor((remaining % 86400) / 3600)),
      minutes: pad(Math.floor((remaining % 3600) / 60)),
      seconds: pad(remaining % 60),
    };
  }
}
