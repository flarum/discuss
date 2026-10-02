import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import Model from 'flarum/common/Model';
import Link from 'flarum/common/components/Link';
import Avatar from 'flarum/common/components/Avatar';
import Icon from 'flarum/common/components/Icon';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import username from 'flarum/common/helpers/username';
import formatNumber from 'flarum/common/utils/formatNumber';
import type User from 'flarum/common/models/User';
import type Mithril from 'mithril';

interface LeaderboardMetric {
  key: string;
  label: string;
  supportsPeriods: boolean;
}

export interface ITopContributorsAttrs extends ComponentAttrs {}

/**
 * This month's leaderboard from fof/gamification. The model is registered by
 * that extension, so its fields are read via `Model.attribute` / `Model.hasOne`
 * rather than importing its typings, which keeps gamification optional.
 */
export default class TopContributors extends Component<ITopContributorsAttrs> {
  static isAvailable(): boolean {
    return 'fof-gamification' in flarum.extensions && !!app.forum.attribute<boolean>('canViewRankingPage');
  }

  private loading: boolean = true;
  private entries: Model[] = [];

  oninit(vnode: Mithril.Vnode<ITopContributorsAttrs, this>) {
    super.oninit(vnode);

    app.store
      .find<Model[]>('leaderboard-entries', {
        filter: { period: 'month' },
        page: { limit: 5 },
      })
      .then((entries) => (this.entries = entries))
      .catch(() => {})
      .finally(() => {
        this.loading = false;
        m.redraw();
      });
  }

  view(): Mithril.Children {
    const metric = this.metric();

    return (
      <section className="HomeWidget TopContributors">
        <header className="HomeWidget-header">
          <h2 className="HomeWidget-title">
            <Icon name="fas fa-trophy" />
            {app.translator.trans('flarum-discuss.forum.home.contributors_title')}
          </h2>
          <Link className="HomeWidget-more" href={app.route('rankings')}>
            {app.translator.trans('flarum-discuss.forum.home.view_all')}
          </Link>
        </header>
        {metric && (
          <p className="HomeWidget-description">
            {app.translator.trans('flarum-discuss.forum.home.contributors_description', { metric: app.translator.trans(metric.label) })}
          </p>
        )}
        {this.content()}
      </section>
    );
  }

  content(): Mithril.Children {
    if (this.loading) return <LoadingIndicator />;

    if (!this.entries.length) {
      return <p className="HomeWidget-empty">{app.translator.trans('flarum-discuss.forum.home.contributors_empty')}</p>;
    }

    return (
      <ol className="TopContributors-list">
        {this.entries.map((entry) => {
          const position = Model.attribute<number>('position').call(entry);
          const user = Model.hasOne<User>('user').call(entry) || null;

          return (
            <li key={entry.id()} className={`TopContributors-entry TopContributors-entry--${position}`}>
              <span className="TopContributors-position">{position}</span>
              <Link className="TopContributors-user" href={user ? app.route.user(user) : undefined}>
                <Avatar user={user} />
                <span className="TopContributors-name">{username(user)}</span>
              </Link>
              <span className="TopContributors-score">{formatNumber(Model.attribute<number>('score').call(entry))}</span>
            </li>
          );
        })}
      </ol>
    );
  }

  /**
   * The ranking falls back to the admin's default metric when none is requested, so label it with that.
   */
  metric(): LeaderboardMetric | undefined {
    const key = app.forum.attribute<string>('fof-gamification.defaultLeaderboardMetric');
    const metrics = app.forum.attribute<LeaderboardMetric[]>('fof-gamification.leaderboardMetrics') || [];

    return metrics.find((metric) => metric.key === key);
  }
}
