import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import type Discussion from 'flarum/common/models/Discussion';
import type Mithril from 'mithril';
export interface IHomeDiscussionCardAttrs extends ComponentAttrs {
    discussion: Discussion;
    variant: 'extension' | 'latest';
}
export default class HomeDiscussionCard extends Component<IHomeDiscussionCardAttrs> {
    view(): Mithril.Children;
}
