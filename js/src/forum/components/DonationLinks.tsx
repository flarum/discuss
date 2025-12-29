import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import Link from 'flarum/common/components/Link';
import type Mithril from 'mithril';

export interface DonationLinksAttrs extends ComponentAttrs {}

/**
 * The `DonationLinks` component displays links to donation platforms
 * like GitHub Sponsors and Open Collective.
 */
export default class DonationLinks<CustomAttrs extends DonationLinksAttrs = DonationLinksAttrs> extends Component<CustomAttrs> {
  view(vnode: Mithril.Vnode<CustomAttrs, this>): Mithril.Children {
    const githubUrl = app.forum.attribute('githubSponsorsUrl');
    const openCollectiveUrl = app.forum.attribute('openCollectiveUrl');

    return (
      <div className="DonationLinks" id="donate">
        <div className="DonationLinks-container">
          <h2 className="DonationLinks-heading">{app.translator.trans('flarum-discuss.forum.supporters.donate_heading')}</h2>
          <p className="DonationLinks-description">{app.translator.trans('flarum-discuss.forum.supporters.donate_description')}</p>

          <div className="DonationLinks-buttons">
            {githubUrl && (
              <Link href={githubUrl} className="DonationLink" external={true}>
                <div className="DonationLink-icon">
                  <i className="fab fa-github"></i>
                </div>
                <div className="DonationLink-content">
                  <h3 className="DonationLink-title">{app.translator.trans('flarum-discuss.forum.supporters.github_sponsors')}</h3>
                  <p className="DonationLink-subtitle">{app.translator.trans('flarum-discuss.forum.supporters.github_sponsors_description')}</p>
                </div>
                <div className="DonationLink-arrow">
                  <i className="fas fa-arrow-right"></i>
                </div>
              </Link>
            )}

            {openCollectiveUrl && (
              <Link href={openCollectiveUrl} className="DonationLink" external={true}>
                <div className="DonationLink-icon">
                  <i className="fas fa-hands-helping"></i>
                </div>
                <div className="DonationLink-content">
                  <h3 className="DonationLink-title">{app.translator.trans('flarum-discuss.forum.supporters.open_collective')}</h3>
                  <p className="DonationLink-subtitle">{app.translator.trans('flarum-discuss.forum.supporters.open_collective_description')}</p>
                </div>
                <div className="DonationLink-arrow">
                  <i className="fas fa-arrow-right"></i>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }
}
