import ItemList from 'flarum/common/utils/ItemList';
import type Discussion from 'flarum/common/models/Discussion';
import type Mithril from 'mithril';
import BaseInfoPage, { IBaseInfoPageAttrs } from './BaseInfoPage';
export declare const EXTENSIONS_TAG_SLUG = "extensions";
export declare const BLOG_TAG_SLUG = "blog";
export interface IHomePageAttrs extends IBaseInfoPageAttrs {
}
export default class HomePage<CustomAttrs extends IHomePageAttrs = IHomePageAttrs> extends BaseInfoPage<CustomAttrs> {
    private loadingBlog;
    private loadingExtensions;
    private loadingLatest;
    private blogDiscussions;
    private extensionDiscussions;
    private latestDiscussions;
    oninit(vnode: Mithril.Vnode<CustomAttrs, this>): void;
    oncreate(vnode: Mithril.VnodeDOM<CustomAttrs, this>): void;
    loadDiscussions(): void;
    /**
     * Every pinned blog post, topped up with the newest unpinned ones to an even
     * count (minimum 2) so the two-column grid never has a gap.
     */
    loadBlog(): Promise<Discussion[]>;
    pageClass(): string;
    heroTitle(): Mithril.Children;
    heroSubtitle(): Mithril.Children;
    heroCta(): Mithril.Children;
    contentItems(): ItemList<Mithril.Children>;
    docsSection(): Mithril.Children;
    docsLinkItems(): ItemList<Mithril.Children>;
    docsLink(href: string, icon: string, title: Mithril.Children, description: Mithril.Children): Mithril.Children;
    contributeSection(): Mithril.Children;
    mainItems(): ItemList<Mithril.Children>;
    railItems(): ItemList<Mithril.Children>;
    blogSection(): Mithril.Children;
    extensionsSection(): Mithril.Children;
    latestSection(): Mithril.Children;
    discussionList(loading: boolean, discussions: Discussion[], variant: 'extension' | 'latest'): Mithril.Children;
}
