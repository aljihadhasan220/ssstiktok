import { TikTokVideo } from '../types';

/**
 * SSSTikTok API Service
 * Robust implementation with URL validation and error simulation.
 */
export const TikTokApiService = {
  validateUrl: (url: string): boolean => {
    return /https?:\/\/(?:[a-z]{2}\.)?(?:tiktok\.com|douyin\.com)\/[a-zA-Z0-9_.\/]+/gm.test(url);
  },

  /**
   * Resolves and analyzes a TikTok URL.
   * In a real production app, this would hit a backend endpoint (e.g., /api/tiktok).
   * Here we implement the full parsing logic and simulate the network handshake.
   */
  analyzeUrl: async (url: string): Promise<TikTokVideo> => {
    if (!TikTokApiService.validateUrl(url)) {
      throw new Error('Please provide a valid TikTok link.');
    }

    try {
      // Use URLSearchParams for application/x-www-form-urlencoded
      const params = new URLSearchParams();
      params.append('url', url);

      const response = await fetch('https://www.tikwm.com/api/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });

      if (!response.ok) {
        throw new Error('API server unreachable. Please try again later.');
      }

      const result = await response.json();

      if (result.code !== 0 || !result.data) {
        throw new Error(result.msg || 'Failed to fetch video data. Check the link.');
      }

      const data = result.data;

      return {
        id: data.id,
        url: url,
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
    } catch (error: any) {
      console.error('API Error:', error);
      throw new Error(error.message || 'An error occurred while analyzing the URL.');
    }
  }
};

const formatCount = (count: number): string => {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
  if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
  return count.toString();
};
