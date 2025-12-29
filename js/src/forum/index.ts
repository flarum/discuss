import app from 'flarum/forum/app';
import addSupportersLink from './addSupportersLink';

export { default as extend } from './extend';

app.initializers.add('flarum-discuss', () => {
  // Add supporters link to the sidebar
  addSupportersLink();
});
