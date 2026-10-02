import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import Icon from 'flarum/common/components/Icon';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';

export interface IContributionTypesAttrs extends ComponentAttrs {}

/**
 * The ways to contribute to Flarum, shared by the Contribute page and the homepage.
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
        app.translator.trans('flarum-discuss.forum.contribute.type_code_desc')
      ),
      100
    );
    items.add(
      'docs',
      this.type(
        'fas fa-book',
        app.translator.trans('flarum-discuss.forum.contribute.type_docs_title'),
        app.translator.trans('flarum-discuss.forum.contribute.type_docs_desc')
      ),
      90
    );
    items.add(
      'i18n',
      this.type(
        'fas fa-language',
        app.translator.trans('flarum-discuss.forum.contribute.type_i18n_title'),
        app.translator.trans('flarum-discuss.forum.contribute.type_i18n_desc')
      ),
      80
    );
    items.add(
      'financial',
      this.type(
        'fas fa-heart',
        app.translator.trans('flarum-discuss.forum.contribute.type_financial_title'),
        app.translator.trans('flarum-discuss.forum.contribute.type_financial_desc')
      ),
      70
    );

    return items;
  }

  type(icon: string, title: Mithril.Children, description: Mithril.Children): Mithril.Children {
    return (
      <div className="ContributionType">
        <div className="ContributionType-icon">
          <Icon name={icon} />
        </div>
        <h3 className="ContributionType-title">{title}</h3>
        <p className="ContributionType-description">{description}</p>
      </div>
    );
  }
}
