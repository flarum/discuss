import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import type Mithril from 'mithril';
export declare const SUPPORT_TAG_SLUG = "support";
export interface IRecentlySolvedAttrs extends ComponentAttrs {
}
/**
 * Support questions most recently marked solved via fof/best-answer. Its
 * fields are read via `Model.attribute` / `Model.hasOne` so best-answer stays optional.
 */
export default class RecentlySolved extends Component<IRecentlySolvedAttrs> {
    static isAvailable(): boolean;
    private loading;
    private discussions;
    oninit(vnode: Mithril.Vnode<IRecentlySolvedAttrs, this>): void;
    view(): Mithril.Children;
    content(): Mithril.Children;
}
