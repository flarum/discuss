<?php

/*
 * This file is part of Flarum.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Flarum\Discuss\Home;

use Flarum\Api\Client;
use Flarum\Extension\ExtensionManager;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Psr\Http\Message\ServerRequestInterface;
use Throwable;

/**
 * The discussion lists shown on the community homepage, fetched server-side
 * as the visiting actor. The query params must match HomePage.tsx and
 * RecentlySolved.tsx exactly: the documents are handed to the frontend as
 * preloaded data in place of its own requests.
 */
class HomeFeed
{
    public const BLOG_TAG = 'blog';
    public const EXTENSIONS_TAG = 'extensions';
    public const SUPPORT_TAG = 'support';

    public function __construct(
        protected Client $api,
        protected ExtensionManager $extensions
    ) {
    }

    /**
     * Raw JSON:API documents keyed by section. A section whose request fails
     * is left out, so the frontend falls back to fetching it itself.
     *
     * @return array<string, array<string, mixed>>
     */
    public function documents(ServerRequestInterface $request): array
    {
        $documents = [];

        foreach ($this->queries() as $key => $params) {
            if ($document = $this->fetch($request, $params)) {
                $documents[$key] = $document;
            }
        }

        return $documents;
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    protected function queries(): array
    {
        $blog = fn (array $filter, int $limit) => [
            'filter' => ['tag' => self::BLOG_TAG] + $filter,
            'sort' => '-createdAt',
            'page' => ['limit' => $limit],
            'include' => 'user,firstPost',
        ];

        // The sticky filter only exists while flarum/sticky is enabled.
        $queries = $this->extensions->isEnabled('flarum-sticky')
            ? ['blogPinned' => $blog(['sticky' => '1'], 50), 'blogUnpinned' => $blog(['-sticky' => '1'], 2)]
            : ['blog' => $blog([], 2)];

        $queries['extensions'] = [
            'filter' => ['tag' => self::EXTENSIONS_TAG],
            'sort' => '-createdAt',
            'page' => ['limit' => 8],
            'include' => 'user,tags',
        ];

        // Unfiltered, so it gets the same /all treatment (hidden tags etc.);
        // extensions are dropped from this buffer by the consumer.
        $queries['latest'] = [
            'sort' => '-lastPostedAt',
            'page' => ['limit' => 20],
            'include' => 'user,lastPostedUser,tags',
        ];

        if ($this->extensions->isEnabled('fof-best-answer')) {
            $queries['solved'] = [
                'filter' => ['tag' => self::SUPPORT_TAG, 'solved-discussions' => 'true'],
                'sort' => '-bestAnswerSetAt',
                'page' => ['limit' => 5],
                'include' => 'bestAnswerPost.user',
            ];
        }

        return $queries;
    }

    /**
     * @return array<string, mixed>|null
     */
    protected function fetch(ServerRequestInterface $request, array $params): ?array
    {
        try {
            $response = $this->api
                ->withoutErrorHandling()
                ->withParentRequest($request)
                ->withQueryParams($params)
                ->get('/discussions');
        } catch (Throwable) {
            // One failed section must not take the homepage down with it.
            return null;
        }

        return json_decode((string) $response->getBody(), true);
    }

    /**
     * Pinned blog posts topped up with unpinned ones to an even count
     * (minimum 2), mirroring HomePage.tsx. Each carries its first-post excerpt.
     *
     * @param array<string, array<string, mixed>> $documents
     * @return array<int, array{discussion: array<string, mixed>, excerpt: ?string}>
     */
    public static function blogPosts(array $documents): array
    {
        if (isset($documents['blog'])) {
            $posts = $documents['blog']['data'];
        } else {
            $pinned = $documents['blogPinned']['data'] ?? [];
            $fill = count($pinned) === 0 ? 2 : count($pinned) % 2;
            $posts = array_merge($pinned, array_slice($documents['blogUnpinned']['data'] ?? [], 0, $fill));
        }

        $included = array_merge(
            $documents['blog']['included'] ?? [],
            $documents['blogPinned']['included'] ?? [],
            $documents['blogUnpinned']['included'] ?? []
        );

        return array_map(fn (array $discussion) => [
            'discussion' => $discussion,
            'excerpt' => self::excerpt($included, $discussion),
        ], $posts);
    }

    /**
     * The latest discussions with extension announcements removed, mirroring HomePage.tsx.
     *
     * @param array<string, mixed> $document
     * @return array<int, array<string, mixed>>
     */
    public static function latestDiscussions(array $document): array
    {
        /** @var array<int, array<string, mixed>> $included */
        $included = $document['included'] ?? [];

        $extensionTagIds = array_column(array_filter(
            $included,
            fn (array $item) => $item['type'] === 'tags' && Arr::get($item, 'attributes.slug') === self::EXTENSIONS_TAG
        ), 'id');

        $discussions = array_filter($document['data'] ?? [], function (array $discussion) use ($extensionTagIds) {
            $tagIds = array_column(Arr::get($discussion, 'relationships.tags.data', []), 'id');

            return ! array_intersect($tagIds, $extensionTagIds);
        });

        return array_slice(array_values($discussions), 0, 8);
    }

    /**
     * A plain-text excerpt of a discussion's first post, from the included posts.
     *
     * @param array<int, array<string, mixed>> $included
     * @param array<string, mixed>             $discussion
     */
    protected static function excerpt(array $included, array $discussion, int $length = 260): ?string
    {
        $postId = Arr::get($discussion, 'relationships.firstPost.data.id');

        foreach ($included as $item) {
            if ($item['type'] === 'posts' && $item['id'] === $postId) {
                $text = trim(preg_replace('/\s+/', ' ', strip_tags((string) Arr::get($item, 'attributes.contentHtml'))));

                return $text === '' ? null : Str::limit($text, $length);
            }
        }

        return null;
    }
}
