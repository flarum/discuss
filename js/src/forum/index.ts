import app from 'flarum/forum/app';
import addLinks from './addLinks';

export { default as extend } from './extend';

app.initializers.add('flarum-discuss', () => {
  addLinks();
});
