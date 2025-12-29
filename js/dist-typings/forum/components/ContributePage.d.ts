import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
import BaseInfoPage, { IBaseInfoPageAttrs } from './BaseInfoPage';
export interface IContributePageAttrs extends IBaseInfoPageAttrs {
}
export default class ContributePage<CustomAttrs extends IContributePageAttrs = IContributePageAttrs> extends BaseInfoPage<CustomAttrs> {
    oninit(vnode: Mithril.Vnode<CustomAttrs, this>): void;
    oncreate(vnode: Mithril.VnodeDOM<CustomAttrs, this>): void;
    pageClass(): string;
    heroTitle(): Mithril.Children;
    heroSubtitle(): Mithril.Children;
    contentItems(): ItemList<Mithril.Children>;
    /**
     * Contribution types section showing different ways to contribute
     */
    contributionTypesSection(): Mithril.Children;
    /**
     * Funding use section showing how funds are spent
     */
    fundingUseSection(): Mithril.Children;
    /**
     * Donation links section
     */
    donationSection(): Mithril.Children;
}
