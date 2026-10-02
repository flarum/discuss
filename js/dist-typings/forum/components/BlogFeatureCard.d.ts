import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import type Discussion from 'flarum/common/models/Discussion';
import type Mithril from 'mithril';
export interface IBlogFeatureCardAttrs extends ComponentAttrs {
    discussion: Discussion;
}
export default class BlogFeatureCard extends Component<IBlogFeatureCardAttrs> {
    view(): Mithril.Children;
}
