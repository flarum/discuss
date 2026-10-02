import app from 'flarum/admin/app';
import { extend } from 'flarum/common/extend';
import BasicsPage from 'flarum/admin/components/BasicsPage';

export { default as extend } from './extend';

app.initializers.add('flarum-discuss', () => {
  extend(BasicsPage, 'homePageItems', (items) => {
    items.add('discussHome', {
      path: '/home',
      label: app.translator.trans('flarum-discuss.admin.basics.home_label'),
    });
  });
});
