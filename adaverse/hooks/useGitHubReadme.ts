'use client';

import { useState, useEffect } from 'react';

export function useGitHubReadme(githubUrl: string) {
  const [readme, setReadme] = useState<string | null>(null);
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

    const fetchReadme = async () => {
      try {
        setLoading(true);
        // GitHub API endpoint for README (returns rendered HTML)
        const response = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/readme`, {
          headers: {
            'Accept': 'application/vnd.github.html+json', // Get HTML version
          },
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            setReadme(null);
            setError(null);
          } else {
            throw new Error(`GitHub API error: ${response.status}`);
          }
          setLoading(false);
          return;
        }

        let htmlContent = await response.text();
        
        // Convert relative image URLs to absolute GitHub URLs
        // This fixes images that use relative paths in the README
        const baseUrl = `https://raw.githubusercontent.com/${owner}/${cleanRepo}/main`;
        
        // Replace relative image src attributes (handles both markdown and HTML images)
        htmlContent = htmlContent.replace(
          /<img([^>]*?)src="(?!http|\/\/)([^"]+)"/gi,
          (match, attrs, src) => {
            // Clean up the path
            let cleanSrc = src;
            if (cleanSrc.startsWith('./')) {
              cleanSrc = cleanSrc.substring(2);
            } else if (cleanSrc.startsWith('../')) {
              cleanSrc = cleanSrc.substring(3);
            }
            
            const absoluteSrc = `${baseUrl}/${cleanSrc}`;
            return `<img${attrs}src="${absoluteSrc}" onerror="this.src=this.src.replace('/main/', '/master/')"`;
          }
        );
        
        // Also handle style attributes and other HTML attributes to preserve formatting
        // Keep align, width, height attributes
        
        setReadme(htmlContent);
        setError(null);
      } catch (err) {
        console.error('Error fetching README:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch README');
      } finally {
        setLoading(false);
      }
    };

    fetchReadme();
  }, [githubUrl]);

  return { readme, loading, error };
}
