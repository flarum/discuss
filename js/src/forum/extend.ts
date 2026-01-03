import Extend from 'flarum/common/extenders';
import commonExtend from '../common/extend';

export default [
  ...commonExtend,

  new Extend.Routes() //
    .add('supporters', '/supporters', () => import('./components/SupportersPage'))
    .add('contribute', '/contribute', () => import('./components/ContributePage')),
];
