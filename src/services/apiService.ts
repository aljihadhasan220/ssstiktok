import { TikTokVideo } from '../types';

/**
 * SSSTikTok API Service
 * Robust implementation with URL validation and error simulation.
 */
// Simple persistent cache using localStorage
interface CacheEntry {
  data: TikTokVideo;
  timestamp: number;
}

const getCache = (): Map<string, CacheEntry> => {
  try {
    const saved = localStorage.getItem('ssstikpro_api_cache');
    return saved ? new Map(JSON.parse(saved)) : new Map<string, CacheEntry>();
  } catch { return new Map<string, CacheEntry>(); }
};

const saveCache = (cache: Map<string, CacheEntry>) => {
  try {
    localStorage.setItem('ssstikpro_api_cache', JSON.stringify(Array.from(cache.entries())));
  } catch (e) { console.warn("Cache save failed:", e); }
};

const apiCache = getCache();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes for persistent cache

export const TikTokApiService = {
  validateUrl: (url: string): boolean => {
    return /https?:\/\/(?:[a-z]{2}\.)?(?:tiktok\.com|douyin\.com)\/[a-zA-Z0-9_.\/]+/gm.test(url);
  },

  /**
   * Resolves and analyzes a TikTok URL.
   */
  analyzeUrl: async (url: string): Promise<TikTokVideo> => {
    if (!TikTokApiService.validateUrl(url)) {
      throw new Error('Please provide a valid TikTok link.');
    }

    // Check cache
    const cached = apiCache.get(url);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
      return cached.data;
    }

    try {
      const params = new URLSearchParams();
      params.append('url', url);

      const response = await fetch('https://www.tikwm.com/api/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
      });

      if (!response.ok) throw new Error('API server unreachable. Please try again later.');
      const result = await response.json();
      if (result.code !== 0 || !result.data) throw new Error(result.msg || 'Failed to fetch video data.');

      const data = result.data;
      const videoData: TikTokVideo = {
        id: data.id,
        url,
        author: {
          username: data.author.nickname || "User",
          avatar: data.author.avatar,
          id: `@${data.author.unique_id}`
        },
        description: data.title || "No description provided.",
        thumbnail: data.cover,
        stats: {
          likes: formatCount(data.digg_count),
          views: formatCount(data.play_count),
          shares: formatCount(data.share_count)
        },
        downloadUrls: {
          noWatermarkHd: data.hdplay || data.play,
          noWatermark: data.play,
          mp3: data.music
        },
        duration: data.duration,
        timestamp: Date.now(),
        fileSize: "Auto",
        images: data.images || [],
        isSlideshow: !!(data.images && data.images.length > 0)
      };

      // Save to cache
      apiCache.set(url, { data: videoData, timestamp: Date.now() });
      saveCache(apiCache);

      return videoData;
    } catch (error: any) {
      console.error('API Error:', error);
      throw new Error(error.message || 'An error occurred during analysis.');
    }
  }
};

const formatCount = (count: number): string => {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
  if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
  return count.toString();
};
