import type Model from 'flarum/common/Model';
import type { ApiQueryParamsPlural } from 'flarum/common/Store';
/**
 * Find a homepage section, using the copy the server rendered into the page
 * (Content\Home → HomeFeed) on first load instead of re-requesting it. The
 * params here must match HomeFeed's for that key.
 *
 * Each preloaded section is used once, and only while the URL is still the
 * one the page booted on — like core's preloadedApiDocument().
 */
export default function findHomeSection<M extends Model>(key: string, params: ApiQueryParamsPlural): Promise<M[]>;
