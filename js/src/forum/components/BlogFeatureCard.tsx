import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import Link from 'flarum/common/components/Link';
import Avatar from 'flarum/common/components/Avatar';
import Icon from 'flarum/common/components/Icon';
import Model from 'flarum/common/Model';
import classList from 'flarum/common/utils/classList';
import username from 'flarum/common/helpers/username';
import { truncate } from 'flarum/common/utils/string';
import type Discussion from 'flarum/common/models/Discussion';
import type Mithril from 'mithril';

export interface IBlogFeatureCardAttrs extends ComponentAttrs {
  discussion: Discussion;
}

export default class BlogFeatureCard extends Component<IBlogFeatureCardAttrs> {
  view(): Mithril.Children {
    const { discussion } = this.attrs;
    const user = discussion.user() || null;
    const firstPost = discussion.firstPost();
    const excerpt = firstPost ? firstPost.contentPlain() : null;
    const createdAt = discussion.createdAt();
    // From flarum/sticky; read generically so sticky stays optional.
    const pinned = !!Model.attribute<boolean | undefined>('isSticky').call(discussion);

    return (
      <Link className={classList('BlogFeatureCard', { 'BlogFeatureCard--pinned': pinned })} href={app.route.discussion(discussion)}>
        {pinned && (
          <span className="BlogFeatureCard-pinned">
            <Icon name="fas fa-thumbtack" />
            {app.translator.trans('flarum-discuss.forum.home.blog_pinned')}
          </span>
        )}
        <h3 className="BlogFeatureCard-title">{discussion.title()}</h3>
        {excerpt && <p className="BlogFeatureCard-excerpt">{truncate(excerpt, 260)}</p>}
        <div className="BlogFeatureCard-footer">
          <Avatar user={user} className="BlogFeatureCard-avatar" />
          <div className="BlogFeatureCard-byline">
            <span className="BlogFeatureCard-author">{username(user)}</span>
            {createdAt && (
              <time className="BlogFeatureCard-date" dateTime={createdAt.toISOString()}>
                {dayjs(createdAt).format('LL')}
              </time>
            )}
          </div>
          <span className="BlogFeatureCard-readMore">
            {app.translator.trans('flarum-discuss.forum.home.blog_read_more')}
            <Icon name="fas fa-arrow-right" />
          </span>
        </div>
      </Link>
    );
  }
}
