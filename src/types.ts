/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Screen = 'home' | 'downloads' | 'favorites' | 'settings';

export type DownloadStatus = 'idle' | 'processing' | 'downloading' | 'completed' | 'error';

export interface TikTokVideo {
  id: string;
  url: string;
  author: {
    username: string;
    avatar: string;
    id: string;
  };
  description: string;
  thumbnail: string;
  stats: {
    likes: string;
    views: string;
    shares: string;
  };
  downloadUrls: {
    noWatermarkHd: string;
    noWatermark: string;
    mp3: string;
  };
  duration: number;
  timestamp: number;
  fileSize?: string;
}

export interface DownloadTask {
  id: string;
  video: TikTokVideo;
  progress: number;
  status: DownloadStatus;
  type: 'hd' | 'nowm' | 'mp3';
  fileName: string;
  timestamp: number;
}

export interface AppState {
  downloads: DownloadTask[];
  favorites: string[]; // List of video IDs
  settings: {
    isDarkMode: boolean;
    accentColor: string;
    autoPaste: boolean;
  };
}
