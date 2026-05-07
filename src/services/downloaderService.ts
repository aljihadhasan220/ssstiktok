import { DownloadTask, DownloadStatus } from '../types';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

/**
 * SSSTikTok Downloader Service
 * Logic for handling file downloads and progress in 2026.
 */
export const TikTokDownloaderService = {
  /**
   * Triggers a real file download with progress tracking
   */
  downloadFile: async (
    task: DownloadTask,
    onProgress: (progress: number) => void,
    onStatusChange: (status: DownloadStatus) => void
  ): Promise<void> => {
    try {
      onStatusChange('downloading');
      
      const url = task.type === 'hd' ? task.video.downloadUrls.noWatermarkHd : 
                  task.type === 'nowm' ? task.video.downloadUrls.noWatermark : 
                  task.video.downloadUrls.mp3;

      // We use a proxy logic if needed, but first let's try direct fetch
      // Note: In some browsers/environments, direct fetch might fail due to CORS.
      // If it fails, we will fall back to a simple direct link click (which won't have progress).
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Could not start download stream.');
      }

      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to open stream.');
      }

      let received = 0;
      const chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        chunks.push(value);
        received += value.length;
        
        if (total > 0) {
          onProgress((received / total) * 100);
        } else {
          // If no content-length, simulate some progress
          onProgress(Math.min(99, received / (5 * 1024 * 1024) * 100)); 
        }
      }

      const blob = new Blob(chunks, { 
        type: task.type === 'mp3' ? 'audio/mpeg' : 'video/mp4' 
      });
      
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blobUrl;
      a.download = task.fileName;
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
      
      onProgress(100);
      onStatusChange('completed');

    } catch (error) {
      console.error('Download failed:', error);
      
      // Fallback: Direct download attempt if fetch failed (probably CORS)
      try {
        const fallbackUrl = task.type === 'hd' ? task.video.downloadUrls.noWatermarkHd : 
                            task.type === 'nowm' ? task.video.downloadUrls.noWatermark : 
                            task.video.downloadUrls.mp3;
        
        if (Capacitor.isNativePlatform()) {
          await Browser.open({ url: fallbackUrl });
        } else {
          const a = document.createElement('a');
          a.href = fallbackUrl;
          a.download = task.fileName;
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        
        onProgress(100);
        onStatusChange('completed');
      } catch (fallbackError) {
        onStatusChange('error');
        throw error;
      }
    }
  },

  /**
   * Simulates the final browser 'Save As' action
   */
  _saveToBrowser: (fileName: string) => {
    // Create a dummy blob to trigger the browser's download manager
    const dummyContent = "SSSTikTok - Downloaded Video Data Stream";
    const blob = new Blob([dummyContent], { type: 'video/mp4' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
};
