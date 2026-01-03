import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import IndexSidebar from 'flarum/forum/components/IndexSidebar';
import LinkButton from 'flarum/common/components/LinkButton';

export default function addLinks() {
  // Add links to the supporters and contribute pages in the sidebar
  extend(IndexSidebar.prototype, 'navItems', function (items) {
    items.add(
      'supporters',
      <LinkButton icon="fas fa-heart" href={app.route('supporters')}>
        {app.translator.trans('flarum-discuss.forum.supporters.title')}
      </LinkButton>,
      15
    );

    items.add(
      'contribute',
      <LinkButton icon="fas fa-hands-helping" href={app.route('contribute')}>
        {app.translator.trans('flarum-discuss.forum.contribute.title')}
      </LinkButton>,
      14
    );

    // Only remove individual tag items when on the Supporters or Contribute page
    const routeName = app.current.get('routeName');
    if (routeName === 'supporters' || routeName === 'contribute') {
      // Remove the separator and all individual tag items added by flarum/tags
      items.remove('separator');

      // Remove individual tag items (they start with 'tag' but NOT 'tags' link itself)
      const itemsArray = items.toArray();
      itemsArray.forEach((item) => {
        const key = item.itemName;
        if (key && key.toString().startsWith('tag') && key !== 'tags') {
          items.remove(key.toString());
        }
      });

      // Also remove the "more tags" link
      items.remove('moreTags');
    }
  });
}
