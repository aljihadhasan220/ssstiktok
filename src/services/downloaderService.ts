import { DownloadTask, DownloadStatus } from '../types';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Media } from '@capacitor-community/media';
import { FileOpener } from '@capacitor-community/file-opener';

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
      
      const remoteUrl = task.type === 'hd' ? task.video.downloadUrls.noWatermarkHd : 
                        task.type === 'nowm' ? task.video.downloadUrls.noWatermark : 
                        task.video.downloadUrls.mp3;

      const filename = task.fileName;
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(remoteUrl)}&filename=${encodeURIComponent(filename)}`;

      // --- NATIVE ANDROID/IOS SAVING ---
      if (Capacitor.isNativePlatform()) {
        const response = await fetch(proxyUrl);
        
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
            onProgress(Math.min(99, (received / (5 * 1024 * 1024)) * 100)); 
          }
        }

        const blob = new Blob(chunks, { 
          type: task.type === 'mp3' ? 'audio/mpeg' : 'video/mp4' 
        });

        try {
          // 1. Permissions
          if (Capacitor.getPlatform() === 'android') {
            await Filesystem.requestPermissions();
          }

          // 2. Convert to Base64
          const base64Data = await TikTokDownloaderService._blobToBase64(blob);
          
          // 3. Save to app cache first as a bridge
          const tempPath = `ssstiktok_${Date.now()}_${task.fileName}`;
          const savedFile = await Filesystem.writeFile({
            path: tempPath,
            data: base64Data,
            directory: Directory.Cache
          });

          // 4. Save to Public Folders / Gallery
          if (task.type === 'mp3') {
            const audioPath = `SSSTikTok/Music/${task.fileName}`;
            await Filesystem.writeFile({
              path: audioPath,
              data: base64Data,
              directory: Directory.Documents,
              recursive: true
            });
            
            const finalFile = await Filesystem.getUri({
              directory: Directory.Documents,
              path: audioPath
            });
            task.savedUri = finalFile.uri;
          } else {
            await Media.saveVideo({
              path: savedFile.uri,
              albumIdentifier: 'SSSTikTok'
            });
            task.savedUri = savedFile.uri; 
          }
        } catch (nativeError) {
          console.error("Native save failed:", nativeError);
          await TikTokDownloaderService._browserFallback(blob, task.fileName);
        }
      } else {
        // --- BROWSER INSTANT DOWNLOAD ---
        // For browsers, redirecting to the proxy starting and managing the download
        // is much faster than fetching the whole blob in JS memory.
        onProgress(50); // Immediate feedback
        
        const link = document.createElement('a');
        link.href = proxyUrl;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
          document.body.removeChild(link);
        }, 100);
      }
      
      onProgress(100);
      onStatusChange('completed');

    } catch (error) {
      console.error('Download failed:', error);
      onStatusChange('error');
      throw error;
    }
  },

  /**
   * Opens a previously downloaded file using native intent
   */
  openFile: async (task: DownloadTask): Promise<void> => {
    if (!Capacitor.isNativePlatform() || !task.savedUri) {
      return;
    }

    try {
      await FileOpener.open({
        filePath: task.savedUri,
        contentType: task.type === 'mp3' ? 'audio/mpeg' : 'video/mp4'
      });
    } catch (e) {
      console.error("Could not open file:", e);
      throw new Error("Could not open file. Try viewing it in your Gallery.");
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
  }
};
