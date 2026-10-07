import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import type Mithril from 'mithril';
import extractText from 'flarum/common/utils/extractText';
import ItemList from 'flarum/common/utils/ItemList';
import abbreviateNumber from 'flarum/common/utils/abbreviateNumber';
import Link from 'flarum/common/components/Link';

export interface ImpactStatsAttrs extends ComponentAttrs {}

interface Stat {
  icon: string;
  value: number;
  label: string;
  // Where the number comes from; external links open in a new tab.
  href: string;
  external?: boolean;
}

// The repository UpdateStatsCommand counts stars, commits and contributors for.
const FRAMEWORK_REPO = 'https://github.com/flarum/framework';

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

    // Supporters count
    const supportersCount = app.forum.attribute<number>('totalSupporters') || 0;
    items.add(
      'supporters',
      this.statItem({
        icon: 'fas fa-users',
        value: supportersCount,
        label: extractText(app.translator.trans('flarum-discuss.forum.supporters.stats.supporters')),
        href: app.route('supporters'),
      }),
      100
    );

    // GitHub Stars
    const githubStars = app.forum.attribute<number>('githubStars') || 0;
    items.add(
      'github-stars',
      this.statItem({
        icon: 'fab fa-github',
        value: githubStars,
        label: extractText(app.translator.trans('flarum-discuss.forum.supporters.stats.github_stars')),
        href: `${FRAMEWORK_REPO}/stargazers`,
        external: true,
      }),
      90
    );

    // Framework Commits
    const frameworkCommits = app.forum.attribute<number>('frameworkCommits') || 0;
    items.add(
      'framework-commits',
      this.statItem({
        icon: 'fas fa-code-branch',
        value: frameworkCommits,
        label: extractText(app.translator.trans('flarum-discuss.forum.supporters.stats.framework_commits')),
        href: `${FRAMEWORK_REPO}/commits`,
        external: true,
      }),
      80
    );

    // Framework Contributors
    const frameworkContributors = app.forum.attribute<number>('frameworkContributors') || 0;
    items.add(
      'framework-contributors',
      this.statItem({
        icon: 'fas fa-user-friends',
        value: frameworkContributors,
        label: extractText(app.translator.trans('flarum-discuss.forum.supporters.stats.framework_contributors')),
        href: `${FRAMEWORK_REPO}/graphs/contributors`,
        external: true,
      }),
      70
    );

    return items;
  }

  statItem(stat: Stat): Mithril.Children {
    const body = [
      <div className="ImpactStat-icon">
        <i className={stat.icon} aria-hidden="true"></i>
      </div>,
      <div className="ImpactStat-content">
        <div className="ImpactStat-value">{abbreviateNumber(stat.value)}</div>
        <div className="ImpactStat-label">{stat.label}</div>
      </div>,
    ];

    return stat.external ? (
      <a className="ImpactStat" href={stat.href} target="_blank" rel="noopener">
        {body}
      </a>
    ) : (
      <Link className="ImpactStat" href={stat.href}>
        {body}
      </Link>
    );
  }
}
