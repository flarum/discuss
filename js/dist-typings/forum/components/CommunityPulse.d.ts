import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
export interface CommunityStats {
    members: number;
    discussions: number;
    posts: number;
    postsToday: number;
    newMembersWeek: number;
    questionsSolved: number | null;
}
export interface ICommunityPulseAttrs extends ComponentAttrs {
}
/**
 * A strip of headline community numbers. The "right now" stats lead, so the
 * page opens on activity rather than history.
 */
export default class CommunityPulse extends Component<ICommunityPulseAttrs> {
    view(): Mithril.Children;
    statItems(): ItemList<Mithril.Children>;
    /**
     * `total` stats are all-time figures; on phones only the recent-activity stats are shown.
     */
    stat(icon: string, value: number, label: Mithril.Children, kind?: 'live' | 'total'): Mithril.Children;
}
