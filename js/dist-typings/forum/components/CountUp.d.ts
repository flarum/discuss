import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import type Mithril from 'mithril';
export interface ICountUpAttrs extends ComponentAttrs {
    value: number;
    duration?: number;
}
/**
 * A number that counts up to its value on first render, so the stats read as live
 * rather than static. Skipped under `prefers-reduced-motion`.
 */
export default class CountUp extends Component<ICountUpAttrs> {
    private displayed;
    private frame?;
    private animating;
    oninit(vnode: Mithril.Vnode<ICountUpAttrs, this>): void;
    oncreate(vnode: Mithril.VnodeDOM<ICountUpAttrs, this>): void;
    onremove(vnode: Mithril.VnodeDOM<ICountUpAttrs, this>): void;
    view(): JSX.Element;
}
