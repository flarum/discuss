import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import Link from 'flarum/common/components/Link';
import classList from 'flarum/common/utils/classList';
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

export interface IHomeBannerAttrs extends ComponentAttrs {}

/**
 * The admin-uploaded homepage image (Settings → Discuss), under the hero.
 * Renders nothing when no image has been uploaded. Like the forum logo, a
 * dark-mode variant is optional and either image covers both themes alone.
 */
export default class HomeBanner extends Component<IHomeBannerAttrs> {
  view(): Mithril.Children {
    const image = app.forum.attribute<HomeImage | null>('discussHomeImage');
    const main = image && (image.light || image.dark);

    if (!image || !main) return null;

    // Only a separately uploaded dark image needs its own element.
    const dark = image.light && image.dark ? image.dark : null;

    const images = [this.img(main, image.alt, false), dark && this.img(dark, image.alt, true)];

    return (
      <div className={classList('HomeBanner', { 'HomeBanner--hasDark': dark })}>
        {image.link ? (
          <Link className="HomeBanner-link" href={image.link} external={!this.isInternal(image.link)}>
            {images}
          </Link>
        ) : (
          images
        )}
      </div>
    );
  }

  img(variant: HomeImageVariant, alt: string, darkMode: boolean): Mithril.Children {
    return (
      <img
        className={classList('HomeBanner-image', { 'HomeBanner-image--dark-mode': darkMode })}
        src={variant.url}
        alt={alt}
        // width/height reserve the space before the image loads; CSS keeps it responsive.
        width={variant.width ?? undefined}
        height={variant.height ?? undefined}
        // Never wider than the image itself: a small upload stays sharp rather than being stretched.
        style={variant.width ? { maxWidth: `${variant.width}px` } : undefined}
        decoding="async"
      />
    );
  }

  isInternal(href: string): boolean {
    try {
      return new URL(href, window.location.href).origin === window.location.origin;
    } catch {
      return false;
    }
  }
}
