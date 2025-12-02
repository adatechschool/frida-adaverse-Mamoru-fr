'use client';

import { useState, useEffect } from 'react';

type GitHubRepo = {
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  default_branch: string;
  license: {
    name: string;
  } | null;
};

type GitHubLanguages = {
  [key: string]: number;
};

type GitHubIssueStats = {
  total_count: number;
  open_count: number;
  closed_count: number;
};

type GitHubPullRequests = {
  total_count: number;
  open_count: number;
  closed_count: number;
};

export function useGitHubRepo(githubUrl: string) {
  const [repoData, setRepoData] = useState<GitHubRepo | null>(null);
  const [languages, setLanguages] = useState<GitHubLanguages | null>(null);
  const [issueStats, setIssueStats] = useState<GitHubIssueStats | null>(null);
  const [pullRequestStats, setPullRequestStats] = useState<GitHubPullRequests | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't fetch if URL is empty
    if (!githubUrl) {
      setLoading(false);
      return;
    }

    // Extract owner and repo name from GitHub URL
    const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      setError('Invalid GitHub URL');
      setLoading(false);
      return;
    }

    const [, owner, repo] = match;
    const cleanRepo = repo.replace(/\.git$/, ''); // Remove .git if present

    const fetchRepoData = async () => {
      try {
        setLoading(true);
        
        // Fetch repository data
        const response = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`);
        
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();
        setRepoData(data);

        // Fetch languages
        const languagesResponse = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/languages`);
        if (languagesResponse.ok) {
          const languagesData = await languagesResponse.json();
          setLanguages(languagesData);
        }

        // Fetch all issues (includes pull requests in the count)
        const issuesResponse = await fetch(`https://api.github.com/search/issues?q=repo:${owner}/${cleanRepo}+type:issue`);
        if (issuesResponse.ok) {
          const issuesData = await issuesResponse.json();
          const openIssuesResponse = await fetch(`https://api.github.com/search/issues?q=repo:${owner}/${cleanRepo}+type:issue+state:open`);
          const openIssuesData = openIssuesResponse.ok ? await openIssuesResponse.json() : { total_count: 0 };
          
          setIssueStats({
            total_count: issuesData.total_count,
            open_count: openIssuesData.total_count,
            closed_count: issuesData.total_count - openIssuesData.total_count,
          });
        }

        // Fetch pull requests
        const prResponse = await fetch(`https://api.github.com/search/issues?q=repo:${owner}/${cleanRepo}+type:pr`);
        if (prResponse.ok) {
          const prData = await prResponse.json();
          const openPrResponse = await fetch(`https://api.github.com/search/issues?q=repo:${owner}/${cleanRepo}+type:pr+state:open`);
          const openPrData = openPrResponse.ok ? await openPrResponse.json() : { total_count: 0 };
          
          setPullRequestStats({
            total_count: prData.total_count,
            open_count: openPrData.total_count,
            closed_count: prData.total_count - openPrData.total_count,
          });
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching GitHub data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch repository data');
      } finally {
        setLoading(false);
      }
    };

    fetchRepoData();
  }, [githubUrl]);

  return { repoData, languages, issueStats, pullRequestStats, loading, error };
}
