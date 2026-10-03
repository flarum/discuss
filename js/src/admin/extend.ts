import app from 'flarum/admin/app';
import Extend from 'flarum/common/extenders';
import commonExtend from '../common/extend';
import Group from 'flarum/common/models/Group';

function groupOptions(): Record<string, string> {
  const options: Record<string, string> = {};

  app.store
    .all<Group>('groups')
    .filter((group) => group.id() !== Group.GUEST_ID && group.id() !== Group.MEMBER_ID)
    .forEach((group) => {
      options[group.id()!] = group.namePlural();
    });

  return options;
}

export default [
  ...commonExtend,

  new Extend.Admin() //
    .setting(() => ({
      setting: 'flarum-discuss.donation-link.github',
      label: app.translator.trans('flarum-discuss.admin.settings.donation_link.github_label'),
      type: 'text',
    }))
    .setting(() => ({
      setting: 'flarum-discuss.donation-link.opencollective',
      label: app.translator.trans('flarum-discuss.admin.settings.donation_link.opencollective_label'),
      type: 'text',
    }))
    .setting(() => ({
      setting: 'flarum-discuss.supporters.monthly-group',
      label: app.translator.trans('flarum-discuss.admin.settings.monthly_group_label'),
      type: 'select',
      options: groupOptions(),
    }))
    .setting(() => ({
      setting: 'flarum-discuss.supporters.one-time-group',
      label: app.translator.trans('flarum-discuss.admin.settings.one_time_group_label'),
      type: 'select',
      options: groupOptions(),
    }))
    // Flarum 2.0 launch (time-boxed: inert after 16 Oct 2026, remove afterwards).
    .setting(() => ({
      setting: 'flarum-discuss.launch.force-phase',
      label: app.translator.trans('flarum-discuss.admin.settings.launch.force_phase_label'),
      help: app.translator.trans('flarum-discuss.admin.settings.launch.force_phase_help'),
      type: 'select',
      options: {
        auto: app.translator.trans('flarum-discuss.admin.settings.launch.phase_auto'),
        teaser: app.translator.trans('flarum-discuss.admin.settings.launch.phase_teaser'),
        launch: app.translator.trans('flarum-discuss.admin.settings.launch.phase_launch'),
        off: app.translator.trans('flarum-discuss.admin.settings.launch.phase_off'),
      },
      default: 'auto',
    }))
    .setting(() => ({
      setting: 'flarum-discuss.launch.event-url',
      label: app.translator.trans('flarum-discuss.admin.settings.launch.event_url_label'),
      help: app.translator.trans('flarum-discuss.admin.settings.launch.event_url_help'),
      type: 'url',
    }))
    .setting(() => ({
      setting: 'flarum-discuss.launch.announcement-url',
      label: app.translator.trans('flarum-discuss.admin.settings.launch.announcement_url_label'),
      type: 'url',
    }))
    .setting(() => ({
      setting: 'flarum-discuss.launch.infographic-url',
      label: app.translator.trans('flarum-discuss.admin.settings.launch.infographic_url_label'),
      type: 'url',
    }))
    .setting(() => ({
      setting: 'flarum-discuss.launch.wallpapers-url',
      label: app.translator.trans('flarum-discuss.admin.settings.launch.wallpapers_url_label'),
      help: app.translator.trans('flarum-discuss.admin.settings.launch.links_help'),
      type: 'url',
    })),
];
