import app from 'flarum/admin/app';
import Extend from 'flarum/common/extenders';
import commonExtend from '../common/extend';
import Group from 'flarum/common/models/Group';

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
      setting: 'flarum-discuss.supporters.github-stars',
      label: app.translator.trans('flarum-discuss.admin.settings.stats.github_stars_label'),
      type: 'number',
    }))
    .setting(() => ({
      setting: 'flarum-discuss.supporters.framework-commits',
      label: app.translator.trans('flarum-discuss.admin.settings.stats.framework_commits_label'),
      type: 'number',
    }))
    .setting(() => ({
      setting: 'flarum-discuss.supporters.framework-contributors',
      label: app.translator.trans('flarum-discuss.admin.settings.stats.framework_contributors_label'),
      type: 'number',
    }))
    .setting(() => {
      const groups = app.store.all<Group>('groups');
      const options: Record<string, string> = {};

      groups
        .filter((group) => {
          const id = group.id()!;
          return id !== Group.GUEST_ID && id !== Group.MEMBER_ID;
        })
        .forEach((group) => {
          options[group.id()!] = group.namePlural();
        });

      return {
        setting: 'flarum-discuss.supporters.monthly-group',
        label: app.translator.trans('flarum-discuss.admin.settings.monthly_group_label'),
        type: 'select',
        options: options,
      };
    })
    .setting(() => {
      const groups = app.store.all<Group>('groups');
      const options: Record<string, string> = {};

      groups
        .filter((group) => {
          const id = group.id()!;
          return id !== Group.GUEST_ID && id !== Group.MEMBER_ID;
        })
        .forEach((group) => {
          options[group.id()!] = group.namePlural();
        });

      return {
        setting: 'flarum-discuss.supporters.one-time-group',
        label: app.translator.trans('flarum-discuss.admin.settings.one_time_group_label'),
        type: 'select',
        options: options,
      };
    }),
];
