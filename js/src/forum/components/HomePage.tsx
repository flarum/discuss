import app from 'flarum/forum/app';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import ItemList from 'flarum/common/utils/ItemList';
import extractText from 'flarum/common/utils/extractText';
import Icon from 'flarum/common/components/Icon';
import Button from 'flarum/common/components/Button';
import Link from 'flarum/common/components/Link';
import classList from 'flarum/common/utils/classList';
import username from 'flarum/common/helpers/username';
import type Discussion from 'flarum/common/models/Discussion';
import type Mithril from 'mithril';

import BaseInfoPage, { IBaseInfoPageAttrs } from './BaseInfoPage';
import HomeDiscussionCard from './HomeDiscussionCard';
import BlogFeatureCard from './BlogFeatureCard';
import CommunityPulse from './CommunityPulse';
import TopContributors from './TopContributors';
import RecentlySolved from './RecentlySolved';
import ContributionTypes from './ContributionTypes';
import ImpactStats from './ImpactStats';
import TeamSection from './TeamSection';
import { SUPPORT_TAG_SLUG } from './RecentlySolved';

export const EXTENSIONS_TAG_SLUG = 'extensions';
export const BLOG_TAG_SLUG = 'blog';
export const DOCS_URL = 'https://docs.flarum.org';

export interface IHomePageAttrs extends IBaseInfoPageAttrs {}

export default class HomePage<CustomAttrs extends IHomePageAttrs = IHomePageAttrs> extends BaseInfoPage<CustomAttrs> {
  private loadingBlog: boolean = true;
  private loadingExtensions: boolean = true;
  private loadingLatest: boolean = true;
  private blogDiscussions: Discussion[] = [];
  private extensionDiscussions: Discussion[] = [];
  private latestDiscussions: Discussion[] = [];

  oninit(vnode: Mithril.Vnode<CustomAttrs, this>) {
    super.oninit(vnode);

    app.history.push('home', extractText(app.translator.trans('flarum-discuss.forum.home.title')));

    this.bodyClass = 'HomePage';

    this.loadDiscussions();
  }

  oncreate(vnode: Mithril.VnodeDOM<CustomAttrs, this>) {
    super.oncreate(vnode);

    app.setTitle(extractText(app.translator.trans('flarum-discuss.forum.home.meta_title')));
    app.setTitleCount(0);
  }

  loadDiscussions() {
    this.loadBlog()
      .then((discussions) => (this.blogDiscussions = discussions))
      .catch(() => {})
      .finally(() => {
        this.loadingBlog = false;
        m.redraw();
      });

    app.store
      .find<Discussion[]>('discussions', {
        filter: { tag: EXTENSIONS_TAG_SLUG },
        sort: '-createdAt',
        page: { limit: 8 },
        include: 'user,tags',
      })
      .then((discussions) => (this.extensionDiscussions = discussions))
      .catch(() => {})
      .finally(() => {
        this.loadingExtensions = false;
        m.redraw();
      });

    app.store
      .find<Discussion[]>('discussions', {
        filter: { '-tag': EXTENSIONS_TAG_SLUG },
        sort: '-lastPostedAt',
        page: { limit: 8 },
        include: 'user,lastPostedUser,tags',
      })
      .then((discussions) => (this.latestDiscussions = discussions))
      .catch(() => {})
      .finally(() => {
        this.loadingLatest = false;
        m.redraw();
      });
  }

  /**
   * Every pinned blog post, topped up with the newest unpinned ones to an even
   * count (minimum 2) so the two-column grid never has a gap.
   */
  async loadBlog(): Promise<Discussion[]> {
    const query = (filter: Record<string, string>, limit: number) =>
      app.store.find<Discussion[]>('discussions', {
        filter: { tag: BLOG_TAG_SLUG, ...filter },
        sort: '-createdAt',
        page: { limit },
        include: 'user,firstPost',
      });

    // The sticky filter only exists while flarum/sticky is enabled.
    if (!('flarum-sticky' in flarum.extensions)) return query({}, 2);

    const [pinned, unpinned] = await Promise.all([query({ sticky: '1' }, 50), query({ '-sticky': '1' }, 2)]);
    const fill = pinned.length === 0 ? 2 : pinned.length % 2;

    return [...pinned, ...unpinned.slice(0, fill)];
  }

  pageClass(): string {
    return 'HomePage';
  }

  heroTitle(): Mithril.Children {
    const user = app.session.user;

    if (user) {
      return app.translator.trans('flarum-discuss.forum.home.hero_title_user', { username: username(user) });
    }

    return app.translator.trans('flarum-discuss.forum.home.hero_title_guest');
  }

  heroSubtitle(): Mithril.Children {
    return app.session.user
      ? app.translator.trans('flarum-discuss.forum.home.hero_subtitle_user')
      : app.translator.trans('flarum-discuss.forum.home.hero_subtitle_guest');
  }

  heroCta(): Mithril.Children {
    if (app.session.user) {
      return (
        <Button className="Button InfoPage-heroCta HomePage-browseCta" icon="fas fa-comments" onclick={() => m.route.set(app.route('index'))}>
          {app.translator.trans('flarum-discuss.forum.home.browse_button')}
        </Button>
      );
    }

    if (!app.forum.attribute('allowSignUp')) return null;

    return (
      <Button
        className="Button InfoPage-heroCta"
        icon="fas fa-user-plus"
        onclick={() => app.modal.show(() => import('flarum/forum/components/SignUpModal'))}
      >
        {app.translator.trans('flarum-discuss.forum.home.join_button')}
      </Button>
    );
  }

  contentItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    // Rail widgets each depend on an optional extension, so the rail may be empty.
    const rail = this.railItems();

    items.add('pulse', <CommunityPulse />, 100);
    items.add(
      'grid',
      <div className={classList('HomePage-grid', { 'HomePage-grid--noRail': rail.isEmpty() })}>
        {this.mainItems().toArray()}
        {!rail.isEmpty() && <aside className="HomePage-rail">{rail.toArray()}</aside>}
      </div>,
      90
    );

    items.add(
      'divider',
      <div className="HomePage-divider" role="separator">
        <span className="HomePage-dividerLabel">{app.translator.trans('flarum-discuss.forum.home.divider_label')}</span>
      </div>,
      80
    );
    items.add('docs', this.docsSection(), 70);
    items.add('contribute', this.contributeSection(), 60);
    if (TeamSection.isAvailable()) items.add('team', <TeamSection />, 50);

    return items;
  }

  docsSection(): Mithril.Children {
    return (
      <section className="HomePage-band HomePage-docs">
        <div className="HomeDocs">
          <div className="HomeDocs-intro">
            <div className="HomeDocs-icon">
              <Icon name="fas fa-book-open" />
            </div>
            <h2 className="HomeDocs-title">{app.translator.trans('flarum-discuss.forum.home.docs_title')}</h2>
            <p className="HomeDocs-text">{app.translator.trans('flarum-discuss.forum.home.docs_description')}</p>
            <a className="Button Button--primary HomeDocs-cta" href={DOCS_URL} target="_blank" rel="noopener">
              <Icon name="fas fa-book" className="Button-icon" />
              <span className="Button-label">{app.translator.trans('flarum-discuss.forum.home.docs_button')}</span>
            </a>
          </div>
          <ul className="HomeDocs-links">{this.docsLinkItems().toArray()}</ul>
        </div>
      </section>
    );
  }

  docsLinkItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add(
      'install',
      this.docsLink(
        `${DOCS_URL}/install`,
        'fas fa-download',
        app.translator.trans('flarum-discuss.forum.home.docs_install'),
        app.translator.trans('flarum-discuss.forum.home.docs_install_desc')
      ),
      100
    );
    items.add(
      'update',
      this.docsLink(
        `${DOCS_URL}/update`,
        'fas fa-sync-alt',
        app.translator.trans('flarum-discuss.forum.home.docs_update'),
        app.translator.trans('flarum-discuss.forum.home.docs_update_desc')
      ),
      90
    );
    items.add(
      'extend',
      this.docsLink(
        `${DOCS_URL}/extend`,
        'fas fa-puzzle-piece',
        app.translator.trans('flarum-discuss.forum.home.docs_extend'),
        app.translator.trans('flarum-discuss.forum.home.docs_extend_desc')
      ),
      80
    );
    items.add(
      'troubleshoot',
      this.docsLink(
        `${DOCS_URL}/troubleshoot`,
        'fas fa-life-ring',
        app.translator.trans('flarum-discuss.forum.home.docs_troubleshoot'),
        app.translator.trans('flarum-discuss.forum.home.docs_troubleshoot_desc')
      ),
      70
    );
    items.add(
      'support',
      <li>
        <Link className="HomeDocs-link" href={app.route('tag', { tags: SUPPORT_TAG_SLUG })}>
          <Icon name="fas fa-question-circle" className="HomeDocs-linkIcon" />
          <span className="HomeDocs-linkText">
            <strong>{app.translator.trans('flarum-discuss.forum.home.docs_support')}</strong>
            <span>{app.translator.trans('flarum-discuss.forum.home.docs_support_desc')}</span>
          </span>
        </Link>
      </li>,
      60
    );

    return items;
  }

  docsLink(href: string, icon: string, title: Mithril.Children, description: Mithril.Children): Mithril.Children {
    return (
      <li>
        <a className="HomeDocs-link" href={href} target="_blank" rel="noopener">
          <Icon name={icon} className="HomeDocs-linkIcon" />
          <span className="HomeDocs-linkText">
            <strong>{title}</strong>
            <span>{description}</span>
          </span>
          <Icon name="fas fa-external-link-alt" className="HomeDocs-external" />
        </a>
      </li>
    );
  }

  contributeSection(): Mithril.Children {
    return (
      <section className="HomePage-band HomePage-contribute">
        <div className="HomePage-bandHeader">
          <h2 className="HomePage-bandTitle">
            <Icon name="fas fa-hands-helping" />
            {app.translator.trans('flarum-discuss.forum.contribute.hero_title')}
          </h2>
          <p className="HomePage-bandLead">{app.translator.trans('flarum-discuss.forum.contribute.hero_subtitle')}</p>
        </div>
        <ContributionTypes />
        <ImpactStats />
        <div className="HomePage-bandActions">
          <Button className="Button Button--primary" icon="fas fa-hands-helping" onclick={() => m.route.set(app.route('contribute'))}>
            {app.translator.trans('flarum-discuss.forum.home.contribute_button')}
          </Button>
          <Button className="Button" icon="fas fa-heart" onclick={() => m.route.set(app.route('supporters'))}>
            {app.translator.trans('flarum-discuss.forum.home.supporters_button')}
          </Button>
        </div>
      </section>
    );
  }

  mainItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add('blog', this.blogSection(), 110);
    items.add('extensions', this.extensionsSection(), 100);
    items.add('latest', this.latestSection(), 90);

    return items;
  }

  railItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    if (TopContributors.isAvailable()) items.add('contributors', <TopContributors />, 100);
    if (RecentlySolved.isAvailable()) items.add('solved', <RecentlySolved />, 90);

    return items;
  }

  blogSection(): Mithril.Children {
    // A blog with nothing in it isn't worth the prime spot.
    if (!this.loadingBlog && !this.blogDiscussions.length) return null;

    return (
      <section className="HomePage-section HomePage-blog">
        <div className="HomePage-sectionHeader">
          <h2 className="HomePage-sectionTitle">
            <Icon name="fas fa-bullhorn" />
            {app.translator.trans('flarum-discuss.forum.home.blog_title')}
          </h2>
          <Link className="HomePage-viewAll" href={app.route('tag', { tags: BLOG_TAG_SLUG })}>
            {app.translator.trans('flarum-discuss.forum.home.view_all')}
          </Link>
        </div>
        {this.loadingBlog ? (
          <LoadingIndicator />
        ) : (
          <div className="HomePage-blogPosts">
            {this.blogDiscussions.map((discussion) => (
              <BlogFeatureCard key={discussion.id()} discussion={discussion} />
            ))}
          </div>
        )}
      </section>
    );
  }

  extensionsSection(): Mithril.Children {
    return (
      <section className="HomePage-section HomePage-extensions">
        <div className="HomePage-sectionHeader">
          <h2 className="HomePage-sectionTitle">
            <Icon name="fas fa-puzzle-piece" />
            {app.translator.trans('flarum-discuss.forum.home.extensions_title')}
          </h2>
          <Link className="HomePage-viewAll" href={app.route('tag', { tags: EXTENSIONS_TAG_SLUG })}>
            {app.translator.trans('flarum-discuss.forum.home.view_all')}
          </Link>
        </div>
        <p className="HomePage-sectionDescription">{app.translator.trans('flarum-discuss.forum.home.extensions_description')}</p>
        {this.discussionList(this.loadingExtensions, this.extensionDiscussions, 'extension')}
      </section>
    );
  }

  latestSection(): Mithril.Children {
    return (
      <section className="HomePage-section HomePage-latest">
        <div className="HomePage-sectionHeader">
          <h2 className="HomePage-sectionTitle">
            <Icon name="fas fa-comments" />
            {app.translator.trans('flarum-discuss.forum.home.latest_title')}
          </h2>
          <Link className="HomePage-viewAll" href={app.route('index')}>
            {app.translator.trans('flarum-discuss.forum.home.view_all')}
          </Link>
        </div>
        <p className="HomePage-sectionDescription">{app.translator.trans('flarum-discuss.forum.home.latest_description')}</p>
        {this.discussionList(this.loadingLatest, this.latestDiscussions, 'latest')}
      </section>
    );
  }

  discussionList(loading: boolean, discussions: Discussion[], variant: 'extension' | 'latest'): Mithril.Children {
    if (loading) return <LoadingIndicator />;

    if (!discussions.length) {
      return <p className="HomePage-empty">{app.translator.trans('flarum-discuss.forum.home.empty')}</p>;
    }

    return (
      <ul className={`HomePage-discussions HomePage-discussions--${variant}`}>
        {discussions.map((discussion) => (
          <li key={discussion.id()}>
            <HomeDiscussionCard discussion={discussion} variant={variant} />
          </li>
        ))}
      </ul>
    );
  }
}
