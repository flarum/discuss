import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
export interface IContributionTypesAttrs extends ComponentAttrs {
}
export declare const DOCS_URL = "https://docs.flarum.org";
/**
 * The ways to contribute to Flarum, shared by the Contribute page and the
 * homepage. Each card links to where that kind of contribution starts.
 */
export default class ContributionTypes extends Component<IContributionTypesAttrs> {
    view(): Mithril.Children;
    typeItems(): ItemList<Mithril.Children>;
    type(icon: string, title: Mithril.Children, description: Mithril.Children, href: string, external: boolean): Mithril.Children;
    /**
     * When the target section is already on this page, scroll to it rather than re-routing.
     */
    scrollIfHere(e: MouseEvent, href: string): void;
}
