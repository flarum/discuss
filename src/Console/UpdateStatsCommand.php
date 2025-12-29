<?php

/*
 * This file is part of Flarum.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Flarum\Discuss\Console;

use Flarum\Console\AbstractCommand;
use Flarum\Settings\SettingsRepositoryInterface;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Symfony\Component\Console\Input\InputOption;

class UpdateStatsCommand extends AbstractCommand
{
    protected Client $http;

    public function __construct(protected SettingsRepositoryInterface $settings)
    {
        parent::__construct();

        $this->http = new Client([
            'timeout' => 10,
            'headers' => [
                'User-Agent' => 'Flarum-Discuss-Extension',
                'Accept' => 'application/vnd.github.v3+json'
            ]
        ]);
    }

    protected function configure(): void
    {
        $this
            ->setName('discuss:update-stats')
            ->setDescription('Fetch and update GitHub statistics for the supporters page')
            ->addOption(
                'github-token',
                't',
                InputOption::VALUE_OPTIONAL,
                'GitHub personal access token for API requests'
            );
    }

    protected function fire(): int
    {
        $this->info('Fetching GitHub statistics...');

        $githubToken = $this->input->getOption('github-token')
            ?? $this->settings->get('flarum-discuss.github-token');

        if ($githubToken) {
            $this->info('Using authenticated requests (higher rate limits)');
        } else {
            $this->info('Using unauthenticated requests (lower rate limits)');
            $this->info('Tip: Pass --github-token for higher rate limits');
        }

        try {
            // Fetch repository statistics
            $stats = $this->fetchGitHubStats($githubToken);

            // Update settings
            $this->settings->set('flarum-discuss.supporters.github-stars', $stats['stars']);
            $this->settings->set('flarum-discuss.supporters.framework-commits', $stats['commits']);
            $this->settings->set('flarum-discuss.supporters.framework-contributors', $stats['contributors']);

            $this->info('');
            $this->info('✓ GitHub Stars: '.number_format($stats['stars']));
            $this->info('✓ Framework Commits: '.number_format($stats['commits']));
            $this->info('✓ Framework Contributors: '.number_format($stats['contributors']));
            $this->info('');
            $this->info('Statistics updated successfully!');

            return 0;
        } catch (GuzzleException $e) {
            $this->error('Failed to fetch GitHub statistics: '.$e->getMessage());

            return 1;
        } catch (\Exception $e) {
            $this->error('An error occurred: '.$e->getMessage());

            return 1;
        }
    }

    /**
     * Fetch statistics from GitHub API.
     */
    protected function fetchGitHubStats(?string $token): array
    {
        // Build headers - only add Authorization if token is provided
        $headers = [
            'User-Agent' => 'Flarum-Discuss-Extension',
            'Accept' => 'application/vnd.github.v3+json'
        ];

        if ($token) {
            $headers['Authorization'] = 'Bearer '.$token;
        }

        $this->info('Fetching repository data from GitHub...');

        // Fetch repository information (for stars)
        $repoResponse = $this->http->get('https://api.github.com/repos/flarum/framework', [
            'headers' => $headers
        ]);
        $repoData = json_decode($repoResponse->getBody()->getContents(), true);
        $stars = $repoData['stargazers_count'] ?? 0;

        $this->info('Fetching commit count...');

        // Fetch total commit count from the default branch
        // GitHub API limits pagination, so we'll use the commits endpoint with pagination
        $commitsResponse = $this->http->get('https://api.github.com/repos/flarum/framework/commits', [
            'headers' => $headers,
            'query' => [
                'per_page' => 1,
                'page' => 1
            ]
        ]);

        // Extract total count from Link header
        $commits = $this->extractTotalFromLinkHeader($commitsResponse->getHeader('Link'));

        $this->info('Fetching contributors count...');

        // Fetch contributors count
        $contributorsResponse = $this->http->get('https://api.github.com/repos/flarum/framework/contributors', [
            'headers' => $headers,
            'query' => [
                'per_page' => 1,
                'anon' => 'true'
            ]
        ]);

        $contributors = $this->extractTotalFromLinkHeader($contributorsResponse->getHeader('Link'));

        // If Link header is not available, count the returned items
        if ($contributors === 0) {
            $contributorsData = json_decode($contributorsResponse->getBody()->getContents(), true);
            $contributors = count($contributorsData);
        }

        if ($commits === 0) {
            // Fallback: use a reasonable estimate or previous value
            $commits = $this->settings->get('flarum-discuss.supporters.framework-commits', 50000);
            $this->info('Could not determine exact commit count, using previous value.');
        }

        return [
            'stars' => $stars,
            'commits' => $commits,
            'contributors' => $contributors
        ];
    }

    /**
     * Extract total count from GitHub API Link header.
     *
     * GitHub uses Link headers for pagination like:
     * <https://api.github.com/resource?page=2>; rel="next", <https://api.github.com/resource?page=5>; rel="last"
     */
    protected function extractTotalFromLinkHeader(array $linkHeaders): int
    {
        if (empty($linkHeaders)) {
            return 0;
        }

        $linkHeader = $linkHeaders[0];

        // Look for rel="last" which contains the last page number
        if (preg_match('/<([^>]+)>;\s*rel="last"/', $linkHeader, $matches)) {
            $lastUrl = $matches[1];

            // Extract page number from URL
            if (preg_match('/[?&]page=(\d+)/', $lastUrl, $pageMatches)) {
                return (int) $pageMatches[1];
            }
        }

        return 0;
    }
}
