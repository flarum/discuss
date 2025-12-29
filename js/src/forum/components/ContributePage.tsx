import app from 'flarum/forum/app';
import ItemList from 'flarum/common/utils/ItemList';
import extractText from 'flarum/common/utils/extractText';
import Icon from 'flarum/common/components/Icon';
import type Mithril from 'mithril';

import BaseInfoPage, { IBaseInfoPageAttrs } from './BaseInfoPage';
import DonationLinks from './DonationLinks';
import ImpactStats from './ImpactStats';

export interface IContributePageAttrs extends IBaseInfoPageAttrs {}

export default class ContributePage<CustomAttrs extends IContributePageAttrs = IContributePageAttrs> extends BaseInfoPage<CustomAttrs> {
  oninit(vnode: Mithril.Vnode<CustomAttrs, this>) {
    super.oninit(vnode);

    // Add page to navigation history
    app.history.push('contribute', extractText(app.translator.trans('flarum-discuss.forum.contribute.title')));

    // Set body class for styling
    this.bodyClass = 'ContributePage';
  }

  oncreate(vnode: Mithril.VnodeDOM<CustomAttrs, this>) {
    super.oncreate(vnode);

    // Set page title and meta
    app.setTitle(extractText(app.translator.trans('flarum-discuss.forum.contribute.meta_title')));
    app.setTitleCount(0);
  }

  pageClass(): string {
    return 'ContributePage';
  }

  heroTitle(): Mithril.Children {
    return app.translator.trans('flarum-discuss.forum.contribute.hero_title');
  }

  heroSubtitle(): Mithril.Children {
    return app.translator.trans('flarum-discuss.forum.contribute.hero_subtitle');
  }

  contentItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add('contributionTypes', this.contributionTypesSection(), 100);
    items.add('impactStats', <ImpactStats />, 90);
    items.add('fundingUse', this.fundingUseSection(), 85);
    items.add('donate', this.donationSection(), 80);

    return items;
  }

  /**
   * Contribution types section showing different ways to contribute
   */
  contributionTypesSection(): Mithril.Children {
    return (
      <div className="ContributePage-contributionTypes">
        <div className="container">
          <div className="InfoPage-sectionHeader">
            <h2 className="InfoPage-sectionTitle">{app.translator.trans('flarum-discuss.forum.contribute.heading')}</h2>
            <p className="InfoPage-sectionLead">{app.translator.trans('flarum-discuss.forum.contribute.description')}</p>
          </div>

          <div className="ContributePage-typeGrid">
            <div className="ContributionType">
              <div className="ContributionType-icon">
                <Icon name="fas fa-code" />
              </div>
              <h3 className="ContributionType-title">{app.translator.trans('flarum-discuss.forum.contribute.type_code_title')}</h3>
              <p className="ContributionType-description">{app.translator.trans('flarum-discuss.forum.contribute.type_code_desc')}</p>
            </div>

            <div className="ContributionType">
              <div className="ContributionType-icon">
                <Icon name="fas fa-book" />
              </div>
              <h3 className="ContributionType-title">{app.translator.trans('flarum-discuss.forum.contribute.type_docs_title')}</h3>
              <p className="ContributionType-description">{app.translator.trans('flarum-discuss.forum.contribute.type_docs_desc')}</p>
            </div>

            <div className="ContributionType">
              <div className="ContributionType-icon">
                <Icon name="fas fa-language" />
              </div>
              <h3 className="ContributionType-title">{app.translator.trans('flarum-discuss.forum.contribute.type_i18n_title')}</h3>
              <p className="ContributionType-description">{app.translator.trans('flarum-discuss.forum.contribute.type_i18n_desc')}</p>
            </div>

            <div className="ContributionType">
              <div className="ContributionType-icon">
                <Icon name="fas fa-heart" />
              </div>
              <h3 className="ContributionType-title">{app.translator.trans('flarum-discuss.forum.contribute.type_financial_title')}</h3>
              <p className="ContributionType-description">{app.translator.trans('flarum-discuss.forum.contribute.type_financial_desc')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Funding use section showing how funds are spent
   */
  fundingUseSection(): Mithril.Children {
    return (
      <div className="ContributePage-fundingUse">
        <div className="container">
          <div className="InfoPage-sectionHeader">
            <h2 className="InfoPage-sectionTitle">{app.translator.trans('flarum-discuss.forum.contribute.funding_use_title')}</h2>
            <p className="InfoPage-sectionLead">{app.translator.trans('flarum-discuss.forum.contribute.funding_use_description')}</p>
          </div>

          <div className="FundingUse-grid">
            <div className="FundingUse-item">
              <div className="FundingUse-icon">
                <Icon name="fas fa-laptop-code" />
              </div>
              <h3 className="FundingUse-title">{app.translator.trans('flarum-discuss.forum.contribute.funding_development_title')}</h3>
              <p className="FundingUse-description">{app.translator.trans('flarum-discuss.forum.contribute.funding_development_desc')}</p>
            </div>

            <div className="FundingUse-item">
              <div className="FundingUse-icon">
                <Icon name="fas fa-shield-alt" />
              </div>
              <h3 className="FundingUse-title">{app.translator.trans('flarum-discuss.forum.contribute.funding_security_title')}</h3>
              <p className="FundingUse-description">{app.translator.trans('flarum-discuss.forum.contribute.funding_security_desc')}</p>
            </div>

            <div className="FundingUse-item">
              <div className="FundingUse-icon">
                <Icon name="fas fa-gift" />
              </div>
              <h3 className="FundingUse-title">{app.translator.trans('flarum-discuss.forum.contribute.funding_bounties_title')}</h3>
              <p className="FundingUse-description">{app.translator.trans('flarum-discuss.forum.contribute.funding_bounties_desc')}</p>
            </div>

            <div className="FundingUse-item">
              <div className="FundingUse-icon">
                <Icon name="fas fa-server" />
              </div>
              <h3 className="FundingUse-title">{app.translator.trans('flarum-discuss.forum.contribute.funding_operations_title')}</h3>
              <p className="FundingUse-description">{app.translator.trans('flarum-discuss.forum.contribute.funding_operations_desc')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Donation links section
   */
  donationSection(): Mithril.Children {
    return <DonationLinks />;
  }
}
