import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import Icon from 'flarum/common/components/Icon';
import Link from 'flarum/common/components/Link';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';

export interface IContributionTypesAttrs extends ComponentAttrs {}

export const DOCS_URL = 'https://docs.flarum.org';

/**
 * The ways to contribute to Flarum, shared by the Contribute page and the
 * homepage. Each card links to where that kind of contribution starts.
 */
export default class ContributionTypes extends Component<IContributionTypesAttrs> {
  view(): Mithril.Children {
    return <div className="ContributePage-typeGrid">{this.typeItems().toArray()}</div>;
  }

  typeItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add(
      'code',
      this.type(
        'fas fa-code',
        app.translator.trans('flarum-discuss.forum.contribute.type_code_title'),
        app.translator.trans('flarum-discuss.forum.contribute.type_code_desc'),
        `${DOCS_URL}/contributing`,
        true
      ),
      100
    );
    items.add(
      'docs',
      this.type(
        'fas fa-book',
        app.translator.trans('flarum-discuss.forum.contribute.type_docs_title'),
        app.translator.trans('flarum-discuss.forum.contribute.type_docs_desc'),
        `${DOCS_URL}/contributing-docs-translations#add-documentation`,
        true
      ),
      90
    );
    items.add(
      'i18n',
      this.type(
        'fas fa-language',
        app.translator.trans('flarum-discuss.forum.contribute.type_i18n_title'),
        app.translator.trans('flarum-discuss.forum.contribute.type_i18n_desc'),
        `${DOCS_URL}/contributing-docs-translations#translate-flarum`,
        true
      ),
      80
    );
    items.add(
      'financial',
      this.type(
        'fas fa-heart',
        app.translator.trans('flarum-discuss.forum.contribute.type_financial_title'),
        app.translator.trans('flarum-discuss.forum.contribute.type_financial_desc'),
        app.route('contribute') + '#donate',
        false
      ),
      70
    );

    return items;
  }

  type(icon: string, title: Mithril.Children, description: Mithril.Children, href: string, external: boolean): Mithril.Children {
    const body = [
      <div className="ContributionType-icon">
        <Icon name={icon} />
      </div>,
      <h3 className="ContributionType-title">{title}</h3>,
      <p className="ContributionType-description">{description}</p>,
    ];

    if (external) {
      return (
        <a className="ContributionType" href={href} target="_blank" rel="noopener">
          {body}
        </a>
      );
    }

    return (
      <Link className="ContributionType" href={href} onclick={(e: MouseEvent) => this.scrollIfHere(e, href)}>
        {body}
      </Link>
    );
  }

  /**
   * When the target section is already on this page, scroll to it rather than re-routing.
   */
  scrollIfHere(e: MouseEvent, href: string) {
    const target = document.getElementById(href.split('#')[1] || '');

    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
