import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import Link from 'flarum/common/components/Link';
import Avatar from 'flarum/common/components/Avatar';
import Icon from 'flarum/common/components/Icon';
import humanTime from 'flarum/common/helpers/humanTime';
import username from 'flarum/common/helpers/username';
import tagsLabel from 'ext:flarum/tags/common/helpers/tagsLabel';
import type Discussion from 'flarum/common/models/Discussion';
import type Mithril from 'mithril';

export interface IHomeDiscussionCardAttrs extends ComponentAttrs {
  discussion: Discussion;
  variant: 'extension' | 'latest';
}

export default class HomeDiscussionCard extends Component<IHomeDiscussionCardAttrs> {
  view(): Mithril.Children {
    const { discussion, variant } = this.attrs;

    // Extension announcements are "new", so credit the author; elsewhere show who last replied.
    const isExtension = variant === 'extension';
    const showReply = !isExtension && (discussion.replyCount() ?? 0) > 0;
    const user = (showReply ? discussion.lastPostedUser() : discussion.user()) || null;
    const time = (showReply ? discussion.lastPostedAt() : discussion.createdAt()) || discussion.createdAt();
    const byline = { username: username(user), ago: time && humanTime(time) };

    return (
      <Link className={`HomeDiscussionCard HomeDiscussionCard--${variant}`} href={app.route.discussion(discussion)}>
        <Avatar user={user} className="HomeDiscussionCard-avatar" />
        <div className="HomeDiscussionCard-body">
          <h3 className="HomeDiscussionCard-title">{discussion.title()}</h3>
          <div className="HomeDiscussionCard-meta">
            {tagsLabel(discussion.tags())}
            <span className="HomeDiscussionCard-byline">
              {showReply
                ? app.translator.trans('flarum-discuss.forum.home.replied_by', byline)
                : app.translator.trans('flarum-discuss.forum.home.started_by', byline)}
            </span>
            <span className="HomeDiscussionCard-replies">
              <Icon name="far fa-comment" />
              {discussion.replyCount() ?? 0}
            </span>
          </div>
        </div>
      </Link>
    );
  }
}
