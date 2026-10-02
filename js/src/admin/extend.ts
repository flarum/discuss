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
    .setting(() => ({
      setting: 'flarum-discuss.home.team-group',
      label: app.translator.trans('flarum-discuss.admin.settings.team_group_label'),
      help: app.translator.trans('flarum-discuss.admin.settings.team_group_help'),
      type: 'select',
      options: groupOptions(),
    })),
];
