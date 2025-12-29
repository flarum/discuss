# Discuss

![License](https://img.shields.io/badge/license-MIT-blue.svg) [![Latest Stable Version](https://img.shields.io/packagist/v/flarum/discuss.svg)](https://packagist.org/packages/flarum/discuss) [![Total Downloads](https://img.shields.io/packagist/dt/flarum/discuss.svg)](https://packagist.org/packages/flarum/discuss)

A [Flarum](https://flarum.org) extension. Theming and customizations for discuss.flarum.org

## Features

### Supporters Page

A dedicated supporters page (`/supporters`) that showcases your community's financial contributors with:

- **Custom Hero Section**: Professional gradient hero with configurable background image
- **Introduction Section**: Editable text explaining your open source mission
- **Monthly Supporters**: Featured section for recurring contributors
- **Community Supporters**: Section for one-time and previous supporters
- **Donation Links**: Direct links to GitHub Sponsors and Open Collective
- **Progressive Loading**: Each section loads independently for a fast, responsive feel

#### Configuration

1. Navigate to the admin panel settings
2. Configure the following options:
   - **GitHub Sponsors URL**: Link to your GitHub Sponsors profile
   - **Open Collective URL**: Link to your Open Collective page
   - **Monthly Supporters Group**: Select which user group represents monthly supporters
   - **One-Time Supporters Group**: Select which user group represents one-time/previous supporters

3. Create custom user groups for your supporters and assign users to them
4. The supporters page will automatically display users from the configured groups

#### Direct Links

You can link directly to the donation section using the anchor:
- `/supporters#donate` - Scrolls directly to the donation links

## Installation

Install with composer:

```sh
composer require flarum/discuss:"*"
```

## Updating

```sh
composer update flarum/discuss:"*"
php flarum migrate
php flarum cache:clear
```

## Links

- [Packagist](https://packagist.org/packages/flarum/discuss)
- [GitHub](https://github.com/flarum/discuss)
- [Discuss](https://discuss.flarum.org/d/PUT_DISCUSS_SLUG_HERE)
