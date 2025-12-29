import app from 'flarum/forum/app';
import Page from 'flarum/common/components/Page';
import type { IPageAttrs } from 'flarum/common/components/Page';
import PageStructure from 'flarum/forum/components/PageStructure';
import IndexSidebar from 'flarum/forum/components/IndexSidebar';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';

export interface IBaseInfoPageAttrs extends IPageAttrs {
  heroTitle?: string;
  heroSubtitle?: string;
  heroCtaText?: string;
  heroCtaAction?: () => void;
  heroCtaIcon?: string;
}

/**
 * BaseInfoPage - A reusable base component for informational pages
 *
 * Provides:
 * - Consistent hero section with SVG background
 * - Standard page structure with sidebar
 * - Reusable hero styling
 *
 * Usage: Extend this class and implement contentItems() to add page content
 */
export default abstract class BaseInfoPage<CustomAttrs extends IBaseInfoPageAttrs = IBaseInfoPageAttrs> extends Page<CustomAttrs> {
  view() {
    return (
      <PageStructure className={`${this.pageClass()} InfoPage Page--vertical`} hero={this.hero.bind(this)} sidebar={this.sidebar.bind(this)}>
        {this.contentItems().toArray()}
      </PageStructure>
    );
  }

  /**
   * Override this to provide page-specific CSS class
   */
  abstract pageClass(): string;

  /**
   * Override this to provide page content
   */
  abstract contentItems(): ItemList<Mithril.Children>;

  /**
   * Hero section with gradient background
   */
  hero(): Mithril.Children {
    const title = this.heroTitle();
    const subtitle = this.heroSubtitle();
    const ctaButton = this.heroCta();

    return (
      <header className="InfoPage-hero Hero">
        <div className="container">
          <div className="InfoPage-heroContent">
            <h1 className="InfoPage-heroTitle">{title}</h1>
            {subtitle && <p className="InfoPage-heroSubtitle">{subtitle}</p>}
            {ctaButton}
          </div>
        </div>
      </header>
    );
  }

  /**
   * Override to provide custom hero title
   */
  abstract heroTitle(): Mithril.Children;

  /**
   * Override to provide custom hero subtitle (optional)
   */
  heroSubtitle(): Mithril.Children | null {
    return null;
  }

  /**
   * Override to provide custom hero CTA button (optional)
   */
  heroCta(): Mithril.Children | null {
    return null;
  }

  /**
   * Standard sidebar
   */
  sidebar(): Mithril.Children {
    return <IndexSidebar />;
  }
}
