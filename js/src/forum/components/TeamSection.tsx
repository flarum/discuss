import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Icon from 'flarum/common/components/Icon';
import type User from 'flarum/common/models/User';
import type Mithril from 'mithril';

import TeamCard from './TeamCard';

export interface ITeamSectionAttrs extends ComponentAttrs {}

export default class TeamSection extends Component<ITeamSectionAttrs> {
  static isAvailable(): boolean {
    return !!app.forum.attribute<string | null>('teamGroupId');
  }

  private loading: boolean = true;
  private members: User[] = [];

  oninit(vnode: Mithril.Vnode<ITeamSectionAttrs, this>) {
    super.oninit(vnode);

    app.store
      .find<User[]>('users', {
        filter: { group: app.forum.attribute<string>('teamGroupId') },
        sort: 'username',
        page: { limit: 50 },
      })
      .then((members) => (this.members = members))
      .catch(() => {})
      .finally(() => {
        this.loading = false;
        m.redraw();
      });
  }

  view(): Mithril.Children {
    // Nothing to introduce; don't leave an empty heading.
    if (!this.loading && !this.members.length) return null;

    return (
      <section className="HomePage-band HomePage-team">
        <div className="HomePage-bandHeader">
          <h2 className="HomePage-bandTitle">
            <Icon name="fas fa-user-astronaut" />
            {app.translator.trans('flarum-discuss.forum.home.team_title')}
          </h2>
          <p className="HomePage-bandLead">{app.translator.trans('flarum-discuss.forum.home.team_description')}</p>
        </div>
        {this.loading ? (
          <LoadingIndicator />
        ) : (
          <div className="TeamCards">
            {this.members.map((user) => (
              <TeamCard key={user.id()} user={user} />
            ))}
          </div>
        )}
      </section>
    );
  }
}
