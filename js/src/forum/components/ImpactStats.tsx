import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import type Mithril from 'mithril';
import extractText from 'flarum/common/utils/extractText';

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
    const stats = this.getStats();

    if (stats.length === 0) {
      return null;
    }

    return (
      <div className="ImpactStats">
        <div className="container">
          <div className="ImpactStats-grid">
            {stats.map((stat) => (
              <div className="ImpactStat">
                <div className="ImpactStat-icon">
                  <i className={stat.icon} aria-hidden="true"></i>
                </div>
                <div className="ImpactStat-content">
                  <div className="ImpactStat-value">{stat.value}</div>
                  <div className="ImpactStat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  getStats(): Stat[] {
    const stats: Stat[] = [];

    // Supporters count (from props)
    const supportersCount = this.attrs.supportersCount;
    if (supportersCount && supportersCount > 0) {
      stats.push({
        icon: 'fas fa-users',
        value: this.formatNumber(supportersCount),
        label: extractText(app.translator.trans('flarum-discuss.forum.supporters.stats.supporters')),
      });
    }

    // GitHub Stars
    const githubStars = app.forum.attribute<number>('githubStars');
    if (githubStars && githubStars > 0) {
      stats.push({
        icon: 'fab fa-github',
        value: this.formatNumber(githubStars),
        label: extractText(app.translator.trans('flarum-discuss.forum.supporters.stats.github_stars')),
      });
    }

    // Framework Commits
    const frameworkCommits = app.forum.attribute<number>('frameworkCommits');
    if (frameworkCommits && frameworkCommits > 0) {
      stats.push({
        icon: 'fas fa-code-branch',
        value: this.formatNumber(frameworkCommits),
        label: extractText(app.translator.trans('flarum-discuss.forum.supporters.stats.framework_commits')),
      });
    }

    // Framework Contributors
    const frameworkContributors = app.forum.attribute<number>('frameworkContributors');
    if (frameworkContributors && frameworkContributors > 0) {
      stats.push({
        icon: 'fas fa-user-friends',
        value: this.formatNumber(frameworkContributors),
        label: extractText(app.translator.trans('flarum-discuss.forum.supporters.stats.framework_contributors')),
      });
    }

    return stats;
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  }
}
