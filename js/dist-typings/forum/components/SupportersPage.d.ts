import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
import type User from 'flarum/common/models/User';
import BaseInfoPage, { IBaseInfoPageAttrs } from './BaseInfoPage';
export interface ISupportersPageAttrs extends IBaseInfoPageAttrs {
}
export default class SupportersPage<CustomAttrs extends ISupportersPageAttrs = ISupportersPageAttrs> extends BaseInfoPage<CustomAttrs> {
    private loadingMonthly;
    private loadingOneTime;
    private monthlySupporers;
    private supporters;
    oninit(vnode: Mithril.Vnode<CustomAttrs, this>): void;
    oncreate(vnode: Mithril.VnodeDOM<CustomAttrs, this>): void;
    /**
     * Scroll to anchor if hash is present in URL
     */
    handleHashNavigation(): void;
    /**
     * Load supporters from the API using group membership
     */
    loadSupporters(): void;
    /**
     * Shuffle array using Fisher-Yates algorithm
     */
    shuffleArray<T>(array: T[]): T[];
    processSupporters(data: User[]): void;
    pageClass(): string;
    heroTitle(): Mithril.Children;
    heroSubtitle(): Mithril.Children;
    contentItems(): ItemList<Mithril.Children>;
    /**
     * Introduction section with thank you message
     */
    introSection(): Mithril.Children;
    /**
     * Monthly supporters section - show all supporters in a grid (4 per row)
     */
    monthlySupportersSection(): Mithril.Children;
    /**
     * One-time and previous supporters section
     */
    supportersSection(): Mithril.Children;
    /**
     * How to appear on this page section
     */
    howToAppearSection(): Mithril.Children;
}
