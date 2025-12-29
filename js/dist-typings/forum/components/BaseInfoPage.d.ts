import Page from 'flarum/common/components/Page';
import type { IPageAttrs } from 'flarum/common/components/Page';
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
    view(): JSX.Element;
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
    hero(): Mithril.Children;
    /**
     * Override to provide custom hero title
     */
    abstract heroTitle(): Mithril.Children;
    /**
     * Override to provide custom hero subtitle (optional)
     */
    heroSubtitle(): Mithril.Children | null;
    /**
     * Override to provide custom hero CTA button (optional)
     */
    heroCta(): Mithril.Children | null;
    /**
     * Standard sidebar
     */
    sidebar(): Mithril.Children;
}
