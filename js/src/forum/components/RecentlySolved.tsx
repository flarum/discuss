import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import Model from 'flarum/common/Model';
import Link from 'flarum/common/components/Link';
import Avatar from 'flarum/common/components/Avatar';
import Icon from 'flarum/common/components/Icon';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import humanTime from 'flarum/common/helpers/humanTime';
import username from 'flarum/common/helpers/username';
import type Discussion from 'flarum/common/models/Discussion';
import type Post from 'flarum/common/models/Post';
import type Mithril from 'mithril';

import findHomeSection from '../utils/homeFeed';

export const SUPPORT_TAG_SLUG = 'support';

export interface IRecentlySolvedAttrs extends ComponentAttrs {}

/**
 * Support questions most recently marked solved via fof/best-answer. Its
 * fields are read via `Model.attribute` / `Model.hasOne` so best-answer stays optional.
 */
export default class RecentlySolved extends Component<IRecentlySolvedAttrs> {
  static isAvailable(): boolean {
    return 'fof-best-answer' in flarum.extensions;
  }

  private loading: boolean = true;
  private discussions: Discussion[] = [];

  oninit(vnode: Mithril.Vnode<IRecentlySolvedAttrs, this>) {
    super.oninit(vnode);

    findHomeSection<Discussion>('solved', {
      filter: { tag: SUPPORT_TAG_SLUG, 'solved-discussions': 'true' },
      // Registered by this extension's extend.php when best-answer is enabled.
      sort: '-bestAnswerSetAt',
      page: { limit: 5 },
      include: 'bestAnswerPost.user',
    })
      .then((discussions) => (this.discussions = discussions))
      .catch(() => {})
      .finally(() => {
        this.loading = false;
        m.redraw();
      });
  }

  view(): Mithril.Children {
    return (
      <section className="HomeWidget RecentlySolved">
        <header className="HomeWidget-header">
          <h2 className="HomeWidget-title">
            <Icon name="fas fa-check-circle" />
            {app.translator.trans('flarum-discuss.forum.home.solved_title')}
          </h2>
          <Link className="HomeWidget-more" href={app.route('tag', { tags: SUPPORT_TAG_SLUG })}>
            {app.translator.trans('flarum-discuss.forum.home.view_all')}
          </Link>
        </header>
        <p className="HomeWidget-description">{app.translator.trans('flarum-discuss.forum.home.solved_description')}</p>
        {this.content()}
      </section>
    );
  }

  content(): Mithril.Children {
    if (this.loading) return <LoadingIndicator />;

    if (!this.discussions.length) {
      return <p className="HomeWidget-empty">{app.translator.trans('flarum-discuss.forum.home.empty')}</p>;
    }

    return (
      <ul className="RecentlySolved-list">
        {this.discussions.map((discussion) => {
          const answer = Model.hasOne<Post>('bestAnswerPost').call(discussion) || null;
          const answerer = (answer && answer.user()) || null;
          const solvedAt = Model.attribute<Date | null, string | null>('bestAnswerSetAt', Model.transformDate).call(discussion);

          return (
            <li key={discussion.id()}>
              <Link className="RecentlySolved-item" href={app.route.discussion(discussion, answer ? answer.number() : undefined)}>
                <Avatar user={answerer} className="RecentlySolved-avatar" />
                <div className="RecentlySolved-body">
                  <span className="RecentlySolved-title">{discussion.title()}</span>
                  <span className="RecentlySolved-meta">
                    {app.translator.trans('flarum-discuss.forum.home.solved_by', {
                      username: username(answerer),
                      ago: solvedAt ? humanTime(solvedAt) : '',
                    })}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }
}
