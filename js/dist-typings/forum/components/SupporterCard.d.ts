import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import type User from 'flarum/common/models/User';
import type Mithril from 'mithril';
export interface SupporterCardAttrs extends ComponentAttrs {
    user: User;
    featured?: boolean;
}
/**
 * The `SupporterCard` component displays a user's avatar and username
 * in a card format for the supporters page.
 *
 * For featured supporters (monthly), the bio is also displayed if available.
 */
export default class SupporterCard<CustomAttrs extends SupporterCardAttrs = SupporterCardAttrs> extends Component<CustomAttrs> {
    view(vnode: Mithril.Vnode<CustomAttrs, this>): Mithril.Children;
    renderBio(user: User): Mithril.Children;
}
