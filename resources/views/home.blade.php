@inject('url', 'Flarum\Http\UrlGenerator')

@php
    $discussionUrl = fn (array $discussion) => $url->to('forum')->route('discussion', ['id' => $discussion['attributes']['slug']]);
    $tagUrl = fn (string $slug) => $url->to('forum')->route('tag', ['slug' => $slug]);
@endphp

<div class="container">
    <h1>{{ $translator->trans('flarum-discuss.forum.home.hero_title_guest') }}</h1>
    <p>{{ $translator->trans('flarum-discuss.forum.home.hero_subtitle_guest') }}</p>

    @if (count($blog))
        <h2>{{ $translator->trans('flarum-discuss.forum.home.blog_title') }}</h2>
        <ul>
            @foreach ($blog as $post)
                <li>
                    <a href="{{ $discussionUrl($post['discussion']) }}">{{ $post['discussion']['attributes']['title'] }}</a>
                    @if ($post['excerpt'])
                        <p>{{ $post['excerpt'] }}</p>
                    @endif
                </li>
            @endforeach
        </ul>
        <a href="{{ $tagUrl($blogTag) }}">{{ $translator->trans('flarum-discuss.forum.home.view_all') }}</a>
    @endif

    @if (count($extensions))
        <h2>{{ $translator->trans('flarum-discuss.forum.home.extensions_title') }}</h2>
        <ul>
            @foreach ($extensions as $discussion)
                <li><a href="{{ $discussionUrl($discussion) }}">{{ $discussion['attributes']['title'] }}</a></li>
            @endforeach
        </ul>
        <a href="{{ $tagUrl($extensionsTag) }}">{{ $translator->trans('flarum-discuss.forum.home.view_all') }}</a>
    @endif

    @if (count($latest))
        <h2>{{ $translator->trans('flarum-discuss.forum.home.latest_title') }}</h2>
        <ul>
            @foreach ($latest as $discussion)
                <li><a href="{{ $discussionUrl($discussion) }}">{{ $discussion['attributes']['title'] }}</a></li>
            @endforeach
        </ul>
        <a href="{{ $url->to('forum')->route('index') }}">{{ $translator->trans('flarum-discuss.forum.home.view_all') }}</a>
    @endif

    @if (count($solved))
        <h2>{{ $translator->trans('flarum-discuss.forum.home.solved_title') }}</h2>
        <ul>
            @foreach ($solved as $discussion)
                <li><a href="{{ $discussionUrl($discussion) }}">{{ $discussion['attributes']['title'] }}</a></li>
            @endforeach
        </ul>
    @endif

    <h2>{{ $translator->trans('flarum-discuss.forum.home.docs_title') }}</h2>
    <p>{{ $translator->trans('flarum-discuss.forum.home.docs_description') }}</p>
    <ul>
        <li><a href="{{ $docsUrl }}">{{ $translator->trans('flarum-discuss.forum.home.docs_button') }}</a></li>
        <li><a href="{{ $docsUrl }}/install">{{ $translator->trans('flarum-discuss.forum.home.docs_install') }}</a></li>
        <li><a href="{{ $docsUrl }}/update">{{ $translator->trans('flarum-discuss.forum.home.docs_update') }}</a></li>
        <li><a href="{{ $docsUrl }}/extend">{{ $translator->trans('flarum-discuss.forum.home.docs_extend') }}</a></li>
        <li><a href="{{ $docsUrl }}/troubleshoot">{{ $translator->trans('flarum-discuss.forum.home.docs_troubleshoot') }}</a></li>
        <li><a href="{{ $tagUrl($supportTag) }}">{{ $translator->trans('flarum-discuss.forum.home.docs_support') }}</a></li>
    </ul>

    <h2>{{ $translator->trans('flarum-discuss.forum.contribute.hero_title') }}</h2>
    <p>{{ $translator->trans('flarum-discuss.forum.contribute.hero_subtitle') }}</p>
    <ul>
        <li><a href="{{ $url->to('forum')->route('contribute') }}">{{ $translator->trans('flarum-discuss.forum.home.contribute_button') }}</a></li>
        <li><a href="{{ $url->to('forum')->route('supporters') }}">{{ $translator->trans('flarum-discuss.forum.home.supporters_button') }}</a></li>
    </ul>
</div>
