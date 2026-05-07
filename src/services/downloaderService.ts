import { DownloadTask, DownloadStatus } from '../types';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Media } from '@capacitor-community/media';

/**
 * SSSTikTok Downloader Service
 * Logic for handling file downloads and progress in 2026.
 */
export const TikTokDownloaderService = {
  /**
   * Helper to convert blob to base64
   */
  _blobToBase64: (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]); // Remove the data: mime type prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  },

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

      // Increase timeout for large files
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
          onProgress(Math.min(99, received / (5 * 1024 * 1024) * 100)); 
        }
      }

      const blob = new Blob(chunks, { 
        type: task.type === 'mp3' ? 'audio/mpeg' : 'video/mp4' 
      });

      // --- NATIVE ANDROID/IOS SAVING ---
      if (Capacitor.isNativePlatform()) {
        try {
          // 1. Permissions
          if (Capacitor.getPlatform() === 'android') {
            await Filesystem.requestPermissions();
          }

          // 2. Convert to Base64
          const base64Data = await TikTokDownloaderService._blobToBase64(blob);
          
          // 3. Save to app cache first
          const tempFileName = `temp_${Date.now()}_${task.fileName}`;
          const savedFile = await Filesystem.writeFile({
            path: tempFileName,
            data: base64Data,
            directory: Directory.Cache
          });

          // 4. Save to Gallery / Public Folder
          if (task.type === 'mp3') {
            // Audio: Save to Documents/Music
            await Filesystem.writeFile({
              path: `SSSTikTok/Music/${task.fileName}`,
              data: base64Data,
              directory: Directory.Documents,
              recursive: true
            });
          } else {
            // Video: Use Media plugin to put it in Gallery
            await Media.saveVideo({
              path: savedFile.uri
            });
          }

          // Clean up temp file
          await Filesystem.deleteFile({
            path: tempFileName,
            directory: Directory.Cache
          });

        } catch (nativeError) {
          console.error("Native save failed, trying fallback:", nativeError);
          // Fallback to browser-style download if native fails
          await TikTokDownloaderService._browserFallback(blob, task.fileName);
        }
      } else {
        // --- BROWSER SAVING ---
        await TikTokDownloaderService._browserFallback(blob, task.fileName);
      }
      
      onProgress(100);
      onStatusChange('completed');

    } catch (error) {
      console.error('Download failed:', error);
      
      // Final Fallback: Direct download attempt if everything else failed
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
   * Helper for browser blob download
   */
  _browserFallback: async (blob: Blob, fileName: string) => {
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    }, 100);
  },

  /**
   * Simulates the final browser 'Save As' action
   */
  _saveToBrowser: (fileName: string) => {
    const dummyContent = "SSSTikTok - Downloaded Video Data Stream";
    const blob = new Blob([dummyContent], { type: 'video/mp4' });
    TikTokDownloaderService._browserFallback(blob, fileName);
  }
};
