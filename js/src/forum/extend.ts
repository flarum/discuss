import Extend from 'flarum/common/extenders';
import commonExtend from '../common/extend';
import SupportersPage from './components/SupportersPage';
import ContributePage from './components/ContributePage';

export default [
  ...commonExtend,

  new Extend.Routes() //
    .add('supporters', '/supporters', SupportersPage)
    .add('contribute', '/contribute', ContributePage),
];
