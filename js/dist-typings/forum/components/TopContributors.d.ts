import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import type Mithril from 'mithril';
interface LeaderboardMetric {
    key: string;
    label: string;
    supportsPeriods: boolean;
}
export interface ITopContributorsAttrs extends ComponentAttrs {
}
/**
 * This month's leaderboard from fof/gamification. The model is registered by
 * that extension, so its fields are read via `Model.attribute` / `Model.hasOne`
 * rather than importing its typings, which keeps gamification optional.
 */
export default class TopContributors extends Component<ITopContributorsAttrs> {
    static isAvailable(): boolean;
    private loading;
    private entries;
    oninit(vnode: Mithril.Vnode<ITopContributorsAttrs, this>): void;
    view(): Mithril.Children;
    content(): Mithril.Children;
    /**
     * The ranking falls back to the admin's default metric when none is requested, so label it with that.
     */
    metric(): LeaderboardMetric | undefined;
}
export {};
