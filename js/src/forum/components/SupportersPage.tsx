import app from 'flarum/forum/app';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import ItemList from 'flarum/common/utils/ItemList';
import extractText from 'flarum/common/utils/extractText';
import Icon from 'flarum/common/components/Icon';
import Button from 'flarum/common/components/Button';
import type Mithril from 'mithril';
import type User from 'flarum/common/models/User';

import BaseInfoPage, { IBaseInfoPageAttrs } from './BaseInfoPage';
import SupporterCard from './SupporterCard';
import ImpactStats from './ImpactStats';

export interface ISupportersPageAttrs extends IBaseInfoPageAttrs {}

export default class SupportersPage<CustomAttrs extends ISupportersPageAttrs = ISupportersPageAttrs> extends BaseInfoPage<CustomAttrs> {
  private loadingMonthly: boolean = false;
  private loadingOneTime: boolean = false;
  private monthlySupporers: User[] = [];
  private supporters: User[] = [];

  oninit(vnode: Mithril.Vnode<CustomAttrs, this>) {
    super.oninit(vnode);

    // Add page to navigation history
    app.history.push('supporters', extractText(app.translator.trans('flarum-discuss.forum.supporters.title')));

    // Set body class for styling
    this.bodyClass = 'SupportersPage';

    // Load supporters data
    this.loadSupporters();
  }

  oncreate(vnode: Mithril.VnodeDOM<CustomAttrs, this>) {
    super.oncreate(vnode);

    // Set page title and meta
    app.setTitle(extractText(app.translator.trans('flarum-discuss.forum.supporters.meta_title')));
    app.setTitleCount(0);

    // Handle hash navigation (e.g., #donate)
    this.handleHashNavigation();
  }

  /**
   * Scroll to anchor if hash is present in URL
   */
  handleHashNavigation() {
    const hash = window.location.hash;
    if (hash) {
      // Use setTimeout to ensure DOM is fully rendered, especially if sections are still loading
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }

  /**
   * Load supporters from the API using group membership
   */
  loadSupporters() {
    // Check if we have preloaded data
    const preloaded = app.preloadedApiDocument<User[]>();
    if (preloaded) {
      this.processSupporters(preloaded);
      return;
    }

    const monthlyGroupId = app.forum.attribute<string>('monthlySupportersGroupId');
    const oneTimeGroupId = app.forum.attribute<string>('oneTimeSupportersGroupId');

    // Load monthly supporters if group is configured
    if (monthlyGroupId) {
      this.loadingMonthly = true;
      app.store
        .find<User[]>('users', {
          filter: { q: `group:${monthlyGroupId}` } as any,
          include: 'groups',
          page: { limit: 500 },
          sort: '-commentCount',
        })
        .then((monthly) => {
          this.monthlySupporers = Array.isArray(monthly) ? monthly : [];
          this.loadingMonthly = false;
          m.redraw();
        })
        .catch((error) => {
          console.error('Error loading monthly supporters:', error);
          this.loadingMonthly = false;
          m.redraw();
        });
    }

    // Load one-time supporters if group is configured
    if (oneTimeGroupId) {
      this.loadingOneTime = true;
      app.store
        .find<User[]>('users', {
          filter: { q: `group:${oneTimeGroupId}` } as any,
          include: 'groups',
          page: { limit: 500 },
          sort: '-commentCount',
        })
        .then((oneTime) => {
          this.supporters = Array.isArray(oneTime) ? oneTime : [];
          this.loadingOneTime = false;
          m.redraw();
        })
        .catch((error) => {
          console.error('Error loading one-time supporters:', error);
          this.loadingOneTime = false;
          m.redraw();
        });
    }
  }

  processSupporters(data: User[]) {
    // Process preloaded data if needed
    // Split into monthly and one-time supporters based on group membership
    const monthlyGroupId = app.forum.attribute<string>('monthlySupportersGroupId');
    const oneTimeGroupId = app.forum.attribute<string>('oneTimeSupportersGroupId');

    // Monthly supporters
    this.monthlySupporers = data.filter((user) => {
      const groups = user.groups();
      return groups && Array.isArray(groups) && groups.some((group) => group?.id() === monthlyGroupId);
    });

    // One-time supporters
    this.supporters = data.filter((user) => {
      const groups = user.groups();
      return groups && Array.isArray(groups) && groups.some((group) => group?.id() === oneTimeGroupId);
    });
  }

  pageClass(): string {
    return 'SupportersPage';
  }

  heroTitle(): Mithril.Children {
    return app.translator.trans('flarum-discuss.forum.supporters.hero_title');
  }

  heroSubtitle(): Mithril.Children {
    return app.translator.trans('flarum-discuss.forum.supporters.hero_subtitle');
  }

  contentItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add('introduction', this.introSection(), 100);

    // Add impact stats section
    items.add('impactStats', <ImpactStats />, 95);

    // Always show monthly section if group is configured
    const monthlyGroupId = app.forum.attribute<string>('monthlySupportersGroupId');
    if (monthlyGroupId) {
      items.add('monthlySupporers', this.monthlySupportersSection(), 90);
    }

    // Always show supporters section if group is configured
    const oneTimeGroupId = app.forum.attribute<string>('oneTimeSupportersGroupId');
    if (oneTimeGroupId) {
      items.add('supporters', this.supportersSection(), 80);
    }

    // Add "how to appear" section
    items.add('howToAppear', this.howToAppearSection(), 70);

    return items;
  }

  /**
   * Introduction section with thank you message
   */
  introSection(): Mithril.Children {
    return (
      <div className="SupportersPage-intro">
        <div className="SupportersPage-introContent">
          <div className="SupportersPage-introImage">
            <img src="/assets/extensions/flarum-discuss/heart-community.avif" alt="Community supporters" loading="lazy" />
          </div>
          <div className="SupportersPage-introText">
            <p>{app.translator.trans('flarum-discuss.forum.supporters.intro_text')}</p>
            <div className="SupportersPage-introActions">
              <Button icon="fas fa-heart" className="Button Button--primary" onclick={() => m.route.set(app.route('contribute'))}>
                {app.translator.trans('flarum-discuss.forum.supporters.become_supporter_button')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Monthly supporters section - show all supporters in a grid (4 per row)
   */
  monthlySupportersSection(): Mithril.Children {
    return (
      <div className="SupportersPage-section SupportersPage-monthlySection">
        <div className="SupportersPage-container">
          <div className="SupportersPage-sectionHeader">
            <h2 className="SupportersPage-sectionTitle">
              <Icon name="fas fa-star" />
              {app.translator.trans('flarum-discuss.forum.supporters.monthly_supporters_title')}
            </h2>
            <p className="SupportersPage-sectionDescription">
              {app.translator.trans('flarum-discuss.forum.supporters.monthly_supporters_description')}
            </p>
          </div>
          <div className="SupporterCards SupporterCards--grid">
            {this.loadingMonthly ? (
              <LoadingIndicator />
            ) : this.monthlySupporers.length > 0 ? (
              this.monthlySupporers.map((user) => <SupporterCard user={user} featured={true} />)
            ) : (
              <div className="SupportersPage-emptyState">
                <Icon name="fas fa-heart" />
                <p>{app.translator.trans('flarum-discuss.forum.supporters.no_monthly_yet')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /**
   * One-time and previous supporters section
   */
  supportersSection(): Mithril.Children {
    return (
      <div className="SupportersPage-section">
        <div className="SupportersPage-container">
          <div className="SupportersPage-sectionHeader">
            <h2 className="SupportersPage-sectionTitle">
              <Icon name="fas fa-heart" />
              {app.translator.trans('flarum-discuss.forum.supporters.supporters_title')}
            </h2>
            <p className="SupportersPage-sectionDescription">{app.translator.trans('flarum-discuss.forum.supporters.supporters_description')}</p>
          </div>
          <div className="SupporterCards SupporterCards--grid">
            {this.loadingOneTime ? (
              <LoadingIndicator />
            ) : this.supporters.length > 0 ? (
              this.supporters.map((user) => <SupporterCard user={user} />)
            ) : (
              <div className="SupportersPage-emptyState">
                <Icon name="fas fa-heart" />
                <p>{app.translator.trans('flarum-discuss.forum.supporters.no_supporters_yet')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /**
   * How to appear on this page section
   */
  howToAppearSection(): Mithril.Children {
    return (
      <div className="SupportersPage-section SupportersPage-howToAppear">
        <div className="SupportersPage-container">
          <div className="SupportersPage-sectionHeader">
            <h2 className="SupportersPage-sectionTitle">
              <Icon name="fas fa-question-circle" />
              {app.translator.trans('flarum-discuss.forum.supporters.how_to_appear_title')}
            </h2>
            <p className="SupportersPage-sectionDescription">{app.translator.trans('flarum-discuss.forum.supporters.how_to_appear_description')}</p>
          </div>

          <div className="HowToAppear">
            <div className="HowToAppear-requirements">
              <div className="HowToAppear-requirement">
                <div className="HowToAppear-requirementIcon">
                  <Icon name="fas fa-user-circle" />
                </div>
                <h3 className="HowToAppear-requirementTitle">{app.translator.trans('flarum-discuss.forum.supporters.requirement_account_title')}</h3>
                <p className="HowToAppear-requirementText">{app.translator.trans('flarum-discuss.forum.supporters.requirement_account_text')}</p>
              </div>

              <div className="HowToAppear-requirement">
                <div className="HowToAppear-requirementIcon">
                  <Icon name="fab fa-github" />
                </div>
                <h3 className="HowToAppear-requirementTitle">{app.translator.trans('flarum-discuss.forum.supporters.requirement_github_title')}</h3>
                <p className="HowToAppear-requirementText">{app.translator.trans('flarum-discuss.forum.supporters.requirement_github_text')}</p>
              </div>

              <div className="HowToAppear-requirement">
                <div className="HowToAppear-requirementIcon">
                  <Icon name="fas fa-hand-holding-heart" />
                </div>
                <h3 className="HowToAppear-requirementTitle">
                  {app.translator.trans('flarum-discuss.forum.supporters.requirement_opencollective_title')}
                </h3>
                <p className="HowToAppear-requirementText">
                  {app.translator.trans('flarum-discuss.forum.supporters.requirement_opencollective_text')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
