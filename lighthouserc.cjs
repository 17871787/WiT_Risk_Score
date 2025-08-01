module.exports = {
  ci: {
    collect: {
      // The URL to test - using the cleaner alias
      url: ['https://ghg-tool-five.vercel.app'],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        // Additional settings for more accurate results
        throttling: {
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        // Performance score must be at least 70%
        'categories:performance': ['error', { minScore: 0.7 }],
        // Accessibility score must be at least 90%
        'categories:accessibility': ['error', { minScore: 0.9 }],
        // Best practices score must be at least 80%
        'categories:best-practices': ['error', { minScore: 0.8 }],
        // SEO score must be at least 80%
        'categories:seo': ['error', { minScore: 0.8 }],
        
        // Specific metric thresholds
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 3000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        
        // Accessibility specific
        'color-contrast': 'error',
        'image-alt': 'error',
        'label': 'error',
        'tabindex': 'error',
        
        // Bundle size warning
        'total-byte-weight': ['warn', { maxNumericValue: 600000 }],
      },
    },
    upload: {
      // Can be configured to upload results to a Lighthouse CI server
      target: 'temporary-public-storage',
    },
  },
};