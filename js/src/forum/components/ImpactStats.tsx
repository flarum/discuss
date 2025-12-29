import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import type Mithril from 'mithril';
import extractText from 'flarum/common/utils/extractText';
import ItemList from 'flarum/common/utils/ItemList';
import abbreviateNumber from 'flarum/common/utils/abbreviateNumber';

export interface ImpactStatsAttrs extends ComponentAttrs {
  supportersCount?: number;
}

interface Stat {
  icon: string;
  value: string;
  label: string;
}

/**
 * The `ImpactStats` component displays key metrics about Flarum's impact
 * and community support.
 */
export default class ImpactStats<CustomAttrs extends ImpactStatsAttrs = ImpactStatsAttrs> extends Component<CustomAttrs> {
  view(vnode: Mithril.Vnode<CustomAttrs, this>): Mithril.Children {
    const stats = this.statsItems();

    if (stats.isEmpty()) {
      return null;
    }

    return (
      <div className="ImpactStats">
        <div className="container">
          <div className="ImpactStats-grid">{stats.toArray()}</div>
        </div>
      </div>
    );
  }

  statsItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    // Supporters count (from props)
    const supportersCount = this.attrs.supportersCount;
    if (supportersCount && supportersCount > 0) {
      items.add(
        'supporters',
        this.statItem({
          icon: 'fas fa-users',
          value: abbreviateNumber(supportersCount),
          label: extractText(app.translator.trans('flarum-discuss.forum.supporters.stats.supporters')),
        }),
        100
      );
    }

    // GitHub Stars
    const githubStars = app.forum.attribute<number>('githubStars');
    if (githubStars && githubStars > 0) {
      items.add(
        'github-stars',
        this.statItem({
          icon: 'fab fa-github',
          value: abbreviateNumber(githubStars),
          label: extractText(app.translator.trans('flarum-discuss.forum.supporters.stats.github_stars')),
        }),
        90
      );
    }

    // Framework Commits
    const frameworkCommits = app.forum.attribute<number>('frameworkCommits');
    if (frameworkCommits && frameworkCommits > 0) {
      items.add(
        'framework-commits',
        this.statItem({
          icon: 'fas fa-code-branch',
          value: abbreviateNumber(frameworkCommits),
          label: extractText(app.translator.trans('flarum-discuss.forum.supporters.stats.framework_commits')),
        }),
        80
      );
    }

    // Framework Contributors
    const frameworkContributors = app.forum.attribute<number>('frameworkContributors');
    if (frameworkContributors && frameworkContributors > 0) {
      items.add(
        'framework-contributors',
        this.statItem({
          icon: 'fas fa-user-friends',
          value: abbreviateNumber(frameworkContributors),
          label: extractText(app.translator.trans('flarum-discuss.forum.supporters.stats.framework_contributors')),
        }),
        70
      );
    }

    return items;
  }

  statItem(stat: Stat): Mithril.Children {
    return (
      <div className="ImpactStat">
        <div className="ImpactStat-icon">
          <i className={stat.icon} aria-hidden="true"></i>
        </div>
        <div className="ImpactStat-content">
          <div className="ImpactStat-value">{stat.value}</div>
          <div className="ImpactStat-label">{stat.label}</div>
        </div>
      </div>
    );
  }
}
