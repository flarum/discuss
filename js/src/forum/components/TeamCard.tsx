import app from 'flarum/forum/app';
import Avatar from 'flarum/common/components/Avatar';
import Link from 'flarum/common/components/Link';
import username from 'flarum/common/helpers/username';
import type Mithril from 'mithril';

import SupporterCard, { SupporterCardAttrs } from './SupporterCard';

/**
 * A horizontal profile card for the homepage team section. Reuses SupporterCard's
 * bio rendering; only the name and avatar link, so links inside the bio stay clickable
 * (SupporterCard wraps everything in one link, which nests anchors).
 */
export default class TeamCard extends SupporterCard<SupporterCardAttrs> {
  view(vnode: Mithril.Vnode<SupporterCardAttrs, this>): Mithril.Children {
    const user = this.attrs.user;

    return (
      <div className="TeamCard">
        <Link href={app.route.user(user)} className="TeamCard-avatar" tabindex="-1" aria-hidden="true">
          <Avatar user={user} loading="lazy" />
        </Link>
        <div className="TeamCard-info">
          <Link href={app.route.user(user)} className="TeamCard-name">
            {username(user)}
          </Link>
          {this.renderBio(user)}
        </div>
      </div>
    );
  }
}
