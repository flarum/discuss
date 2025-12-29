import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import type Mithril from 'mithril';
import ItemList from 'flarum/common/utils/ItemList';
export interface ImpactStatsAttrs extends ComponentAttrs {
}
interface Stat {
    icon: string;
    value: number;
    label: string;
}
/**
 * The `ImpactStats` component displays key metrics about Flarum's impact
 * and community support.
 */
export default class ImpactStats<CustomAttrs extends ImpactStatsAttrs = ImpactStatsAttrs> extends Component<CustomAttrs> {
    view(vnode: Mithril.Vnode<CustomAttrs, this>): Mithril.Children;
    statsItems(): ItemList<Mithril.Children>;
    statItem(stat: Stat): Mithril.Children;
}
export {};
