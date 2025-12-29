import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import type Mithril from 'mithril';
export interface SupportersHeroAttrs extends ComponentAttrs {
    backgroundImage?: string;
}
/**
 * The `SupportersHero` component displays a hero banner on the supporters page
 * with an optional background image and welcome text.
 */
export default class SupportersHero<CustomAttrs extends SupportersHeroAttrs = SupportersHeroAttrs> extends Component<CustomAttrs> {
    view(vnode: Mithril.Vnode<CustomAttrs, this>): Mithril.Children;
    scrollToDonate(e: Event): void;
}
