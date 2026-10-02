import Extend from 'flarum/common/extenders';
import commonExtend from '../common/extend';

export default [
  ...commonExtend,

  new Extend.Routes() //
    .add('home', '/home', () => import('./components/HomePage'))
    .add('supporters', '/supporters', () => import('./components/SupportersPage'))
    .add('contribute', '/contribute', () => import('./components/ContributePage')),
];
