import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import type Mithril from 'mithril';
export interface HomeImageVariant {
    url: string;
    width: number | null;
    height: number | null;
}
export interface HomeImage {
    light: HomeImageVariant | null;
    dark: HomeImageVariant | null;
    link: string | null;
    alt: string;
}
export interface IHomeBannerAttrs extends ComponentAttrs {
}
/**
 * The admin-uploaded homepage image (Settings → Discuss), under the hero.
 * Renders nothing when no image has been uploaded. Like the forum logo, a
 * dark-mode variant is optional and either image covers both themes alone.
 */
export default class HomeBanner extends Component<IHomeBannerAttrs> {
    view(): Mithril.Children;
    img(variant: HomeImageVariant, alt: string, darkMode: boolean): Mithril.Children;
    isInternal(href: string): boolean;
}
