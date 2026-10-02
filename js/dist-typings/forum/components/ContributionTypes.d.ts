import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
export interface IContributionTypesAttrs extends ComponentAttrs {
}
/**
 * The ways to contribute to Flarum, shared by the Contribute page and the homepage.
 */
export default class ContributionTypes extends Component<IContributionTypesAttrs> {
    view(): Mithril.Children;
    typeItems(): ItemList<Mithril.Children>;
    type(icon: string, title: Mithril.Children, description: Mithril.Children): Mithril.Children;
}
