import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import Avatar from 'flarum/common/components/Avatar';
import username from 'flarum/common/helpers/username';
import Link from 'flarum/common/components/Link';
import type User from 'flarum/common/models/User';
import type Mithril from 'mithril';

export interface SupporterCardAttrs extends ComponentAttrs {
  user: User;
  featured?: boolean;
}

/**
 * The `SupporterCard` component displays a user's avatar and username
 * in a card format for the supporters page.
 *
 * For featured supporters (monthly), the bio is also displayed if available.
 */
export default class SupporterCard<CustomAttrs extends SupporterCardAttrs = SupporterCardAttrs> extends Component<CustomAttrs> {
  view(vnode: Mithril.Vnode<CustomAttrs, this>): Mithril.Children {
    const user = this.attrs.user;
    const featured = this.attrs.featured || false;

    return (
      <div className={`SupporterCard${featured ? ' SupporterCard--featured' : ''}`}>
        <Link href={app.route.user(user)} className="SupporterCard-link">
          <div className="SupporterCard-avatar">
            <Avatar user={user} loading="lazy" />
          </div>
          <div className="SupporterCard-info">
            <h3 className="SupporterCard-username">{username(user)}</h3>
            {featured && this.renderBio(user)}
          </div>
        </Link>
      </div>
    );
  }

  renderBio(user: User): Mithril.Children {
    // Try to get formatted HTML bio first (if fof/user-bio with formatting is enabled)
    const bioHtml = user.attribute<string | null>('bioHtml');

    if (bioHtml && bioHtml.trim()) {
      return <div className="SupporterCard-bio">{m.trust(bioHtml)}</div>;
    }

    // Fall back to plain text bio
    const bio = user.attribute<string | null>('bio');
    if (bio && bio.trim().length > 0) {
      // Simple sanitization: escape HTML and convert newlines to <br>
      const sanitizedBio = bio.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');

      return <div className="SupporterCard-bio">{m.trust(sanitizedBio)}</div>;
    }

    return null;
  }
}
