// Type definition for supported link types
export type LinkType = 'youtube' | 'googledocs' | 'googleslides' | 'pdf' | 'web';

interface URLTypeConfig {
  type: LinkType;
  patterns: string[];
  validator?: (url: string) => boolean;
}

// Configuration for URL type detection
const URL_TYPES: URLTypeConfig[] = [
  {
    type: 'youtube',
    patterns: ['youtube.com', 'youtu.be'],
    validator: (url: string) => {
      try {
        const urlObj = new URL(url);
        if (urlObj.hostname.includes('youtube.com')) {
          return !!urlObj.searchParams.get('v');
        } else if (urlObj.hostname.includes('youtu.be')) {
          return urlObj.pathname.length > 1;
        }
      } catch (e) {
        console.error('Error validating YouTube URL:', e);
      }
      return false;
    }
  },
  {
    type: 'googledocs',
    patterns: ['docs.google.com/document']
  },
  {
    type: 'googleslides',
    patterns: ['docs.google.com/presentation', 'slides.google.com']
  },
  {
    type: 'pdf',
    patterns: ['.pdf'],
    validator: (url: string) => url.toLowerCase().endsWith('.pdf')
  }
];

/**
 * Determines the type of a URL based on predefined patterns
 * @param url The URL to check
 * @returns The detected link type
 */
export function getLinkType(url: string): LinkType {
  const lowerUrl = url.toLowerCase();
  
  for (const urlType of URL_TYPES) {
    if (urlType.patterns.some(pattern => lowerUrl.includes(pattern))) {
      if (!urlType.validator || urlType.validator(url)) {
        return urlType.type;
      }
    }
  }
  
  return 'web';
}

/**
 * Extracts the video ID from a YouTube URL
 * @param url The YouTube URL
 * @returns The video ID or null if invalid
 */
export function getYouTubeVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v');
    } else if (urlObj.hostname.includes('youtu.be')) {
      return urlObj.pathname.substring(1);
    }
  } catch (e) {
    console.error('Error parsing YouTube URL:', e);
  }
  return null;
}

/**
 * Normalizes a YouTube URL to a standard format for comparison
 * @param url The URL to normalize
 * @returns The normalized URL
 */
export function normalizeYouTubeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v');
      if (videoId) {
        return `youtube.com/watch?v=${videoId}`;
      }
    } else if (urlObj.hostname.includes('youtu.be')) {
      const videoId = urlObj.pathname.substring(1);
      if (videoId) {
        return `youtube.com/watch?v=${videoId}`;
      }
    }
    return url.toLowerCase();
  } catch (e) {
    console.error('Error normalizing URL:', e);
    return url.toLowerCase();
  }
} 