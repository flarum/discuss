import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import type Mithril from 'mithril';
export interface DonationLinksAttrs extends ComponentAttrs {
}
/**
 * The `DonationLinks` component displays links to donation platforms
 * like GitHub Sponsors and Open Collective.
 */
export default class DonationLinks<CustomAttrs extends DonationLinksAttrs = DonationLinksAttrs> extends Component<CustomAttrs> {
    view(vnode: Mithril.Vnode<CustomAttrs, this>): Mithril.Children;
}
