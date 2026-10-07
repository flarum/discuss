import app from 'flarum/admin/app';
import Extend from 'flarum/common/extenders';
import commonExtend from '../common/extend';
import Group from 'flarum/common/models/Group';
import UploadImageButton from 'flarum/common/components/UploadImageButton';

// Below this the banner can't fill the content column sharply on 2× screens.
const HOME_IMAGE_SHARP_WIDTH = 2400;

type HomeImageVariant = { url: string; width: number | null; height: number | null } | null;

function homeImageVariant(variant: 'light' | 'dark'): HomeImageVariant {
  return app.forum.attribute<Record<'light' | 'dark', HomeImageVariant> | null>('discussHomeImage')?.[variant] ?? null;
}

function homeImageSizeNote(image: HomeImageVariant) {
  if (!image?.width || !image.height) return null;

  const size = `${image.width}×${image.height}`;

  return image.width < HOME_IMAGE_SHARP_WIDTH ? (
    <div className="helpText">
      {app.translator.trans('flarum-discuss.admin.settings.home_image.too_small', { size, min: HOME_IMAGE_SHARP_WIDTH })}
    </div>
  ) : (
    <div className="helpText">{app.translator.trans('flarum-discuss.admin.settings.home_image.current_size', { size })}</div>
  );
}

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
    // Homepage banner: uploaded and converted to WebP by UploadHomeImageController.
    .customSetting(() => (
      <div className="Form-group">
        <label>{app.translator.trans('flarum-discuss.admin.settings.home_image.label')}</label>
        <div className="helpText">{app.translator.trans('flarum-discuss.admin.settings.home_image.help')}</div>
        <UploadImageButton
          name="discuss-home-image"
          routePath="discuss-home-image"
          value={app.data.settings['flarum-discuss.home.image_path']}
          url={homeImageVariant('light')?.url}
        />
        {homeImageSizeNote(homeImageVariant('light'))}
      </div>
    ))
    .customSetting(() => (
      <div className="Form-group">
        <label>{app.translator.trans('flarum-discuss.admin.settings.home_image.dark_label')}</label>
        <div className="helpText">{app.translator.trans('flarum-discuss.admin.settings.home_image.dark_help')}</div>
        <UploadImageButton
          name="discuss-home-image-dark"
          routePath="discuss-home-image-dark"
          value={app.data.settings['flarum-discuss.home.image_dark_path']}
          url={homeImageVariant('dark')?.url}
        />
        {homeImageSizeNote(homeImageVariant('dark'))}
      </div>
    ))
    .setting(() => ({
      setting: 'flarum-discuss.home.image_link',
      label: app.translator.trans('flarum-discuss.admin.settings.home_image.link_label'),
      help: app.translator.trans('flarum-discuss.admin.settings.home_image.link_help'),
      type: 'url',
    }))
    .setting(() => ({
      setting: 'flarum-discuss.home.image_alt',
      label: app.translator.trans('flarum-discuss.admin.settings.home_image.alt_label'),
      help: app.translator.trans('flarum-discuss.admin.settings.home_image.alt_help'),
      type: 'text',
    })),
];
