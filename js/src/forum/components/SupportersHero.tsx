import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
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
  view(vnode: Mithril.Vnode<CustomAttrs, this>): Mithril.Children {
    const backgroundImage = this.attrs.backgroundImage || app.forum.attribute('supportersHeroBackground');
    const style = backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {};

    return (
      <header className="SupportersHero Hero" style={style}>
        <div className="container">
          <div className="SupportersHero-content">
            <h1 className="SupportersHero-title">{app.translator.trans('flarum-discuss.forum.supporters.hero_title')}</h1>
            <p className="SupportersHero-subtitle">{app.translator.trans('flarum-discuss.forum.supporters.hero_subtitle')}</p>
            <Button className="Button Button--primary SupportersHero-cta" icon="fas fa-heart" onclick={this.scrollToDonate.bind(this)}>
              {app.translator.trans('flarum-discuss.forum.supporters.hero_cta')}
            </Button>
          </div>
        </div>
      </header>
    );
  }

  scrollToDonate(e: Event) {
    e.preventDefault();
    const donateSection = document.querySelector('#donate');
    if (donateSection) {
      donateSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
