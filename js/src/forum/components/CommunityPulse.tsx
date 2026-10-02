import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import Icon from 'flarum/common/components/Icon';
import ItemList from 'flarum/common/utils/ItemList';
import classList from 'flarum/common/utils/classList';
import type Mithril from 'mithril';

import CountUp from './CountUp';

export interface CommunityStats {
  members: number;
  discussions: number;
  posts: number;
  postsToday: number;
  newMembersWeek: number;
  questionsSolved: number | null;
}

export interface ICommunityPulseAttrs extends ComponentAttrs {}

/**
 * A strip of headline community numbers. The "right now" stats lead, so the
 * page opens on activity rather than history.
 */
export default class CommunityPulse extends Component<ICommunityPulseAttrs> {
  view(): Mithril.Children {
    const items = this.statItems();

    if (items.isEmpty()) return null;

    return (
      <section className="CommunityPulse" aria-label={app.translator.trans('flarum-discuss.forum.home.pulse_label', {}, true)}>
        {items.toArray()}
      </section>
    );
  }

  statItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const stats = app.forum.attribute<CommunityStats | undefined>('communityStats');

    if (!stats) return items;

    // fof/online-users-widget already computes this per actor, honouring discloseOnline and visibility.
    if ('fof-online-users-widget' in flarum.extensions) {
      items.add(
        'onlineNow',
        this.stat(
          'fas fa-circle',
          app.forum.attribute<number>('totalOnlineUsers') ?? 0,
          app.translator.trans('flarum-discuss.forum.home.stats.online_now'),
          'live'
        ),
        100
      );
    }
    items.add('postsToday', this.stat('fas fa-bolt', stats.postsToday, app.translator.trans('flarum-discuss.forum.home.stats.posts_today')), 90);
    items.add(
      'newMembersWeek',
      this.stat('fas fa-user-plus', stats.newMembersWeek, app.translator.trans('flarum-discuss.forum.home.stats.new_members_week')),
      80
    );

    if (stats.questionsSolved !== null) {
      items.add(
        'questionsSolved',
        this.stat('fas fa-check-circle', stats.questionsSolved, app.translator.trans('flarum-discuss.forum.home.stats.questions_solved')),
        70
      );
    }

    items.add('members', this.stat('fas fa-users', stats.members, app.translator.trans('flarum-discuss.forum.home.stats.members'), 'total'), 60);
    items.add(
      'discussions',
      this.stat('fas fa-comments', stats.discussions, app.translator.trans('flarum-discuss.forum.home.stats.discussions'), 'total'),
      50
    );
    items.add('posts', this.stat('fas fa-pen', stats.posts, app.translator.trans('flarum-discuss.forum.home.stats.posts'), 'total'), 40);

    return items;
  }

  /**
   * `total` stats are all-time figures; on phones only the recent-activity stats are shown.
   */
  stat(icon: string, value: number, label: Mithril.Children, kind?: 'live' | 'total'): Mithril.Children {
    return (
      <div className={classList('CommunityPulse-stat', kind && `CommunityPulse-stat--${kind}`)}>
        <Icon name={icon} className="CommunityPulse-icon" />
        <div className="CommunityPulse-value">
          <CountUp value={value} />
        </div>
        <div className="CommunityPulse-label">{label}</div>
      </div>
    );
  }
}
