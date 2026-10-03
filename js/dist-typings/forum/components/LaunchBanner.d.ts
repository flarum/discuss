import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
export type LaunchPhase = 'teaser' | 'launch';
export interface DiscussLaunch {
    phase: LaunchPhase | null;
    fixed: boolean;
    launchAt: string;
    endsAt: string;
    links: Record<'event' | 'announcement' | 'infographic' | 'wallpapers', string | null>;
}
/**
 * The phase as of now. Recomputed from the timestamps (so an open tab flips
 * at launch) unless an admin override pinned it server-side.
 */
export declare function currentLaunchPhase(launch: DiscussLaunch): LaunchPhase | null;
export interface ILaunchBannerAttrs extends ComponentAttrs {
}
/**
 * Flarum 2.0 launch banner for the homepage: a countdown teaser until launch,
 * then links to the announcement and artwork for launch week. Time-boxed; it
 * renders nothing after the launch period.
 */
export default class LaunchBanner extends Component<ILaunchBannerAttrs> {
    view(): Mithril.Children;
    teaserItems(launch: DiscussLaunch): ItemList<Mithril.Children>;
    launchItems(launch: DiscussLaunch): ItemList<Mithril.Children>;
    link(href: string, icon: string, label: Mithril.Children, primary?: boolean): Mithril.Children;
}
