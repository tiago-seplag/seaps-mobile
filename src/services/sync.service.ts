import { LocalStorageService, PendingUpload } from "./local-storage.service";
import { api } from "./api";
import NetInfo from "@react-native-community/netinfo";

export class SyncService {
  private static isOnline = false;
  private static isProcessing = false;

  static async initialize() {
    // Monitor network status
    NetInfo.addEventListener((state) => {
      this.isOnline = state.isConnected ?? false;
      if (this.isOnline && !this.isProcessing) {
        this.processPendingUploads();
      }
    });

    // Check initial status
    const netInfo = await NetInfo.fetch();
    this.isOnline = netInfo.isConnected ?? false;
  }

  static async processPendingUploads() {
    if (this.isProcessing || !this.isOnline) return;

    this.isProcessing = true;

    try {
      const pendingUploads = await LocalStorageService.getPendingUploads();

      for (const upload of pendingUploads) {
        if (!this.isOnline) break; // Stop if connection lost

        try {
          await this.processUpload(upload);
          await LocalStorageService.removePendingUpload(upload.id);
        } catch (error) {
          console.warn(`Failed to sync upload ${upload.id}:`, error);
          await LocalStorageService.incrementRetryCount(upload.id);

          // Remove after 3 failed attempts
          if (upload.retryCount >= 3) {
            await LocalStorageService.removePendingUpload(upload.id);
          }
        }
      }
    } catch (error) {
      console.error("Error processing pending uploads:", error);
    } finally {
      this.isProcessing = false;
    }
  }

  private static async processUpload(upload: PendingUpload) {
    switch (upload.type) {
      case "image_upload":
        await this.processImageUpload(upload);
        break;
      case "image_update":
        await this.processImageUpdate(upload);
        break;
      case "image_delete":
        await this.processImageDelete(upload);
        break;
    }
  }

  private static async processImageUpload(upload: PendingUpload) {
    // Reconstruct FormData from stored data
    const formData = new FormData();

    // Add files
    for (const file of upload.data.files) {
      formData.append("file", {
        uri: file.uri,
        type: file.type,
        name: file.name,
      } as any);
    }

    // Add folder
    formData.append("folder", upload.data.folder);

    await api.post(
      `/api/v1/checklist-items/${upload.itemId}/upload`,
      formData,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      },
    );
  }

  private static async processImageUpdate(upload: PendingUpload) {
    await api.put(
      `/api/v1/checklist-items/${upload.itemId}/images/${upload.data.imageId}`,
      { observation: upload.data.observation },
    );
  }

  private static async processImageDelete(upload: PendingUpload) {
    await api.delete(
      `/api/v1/checklist-items/${upload.itemId}/images/${upload.data.imageId}`,
    );
  }

  static async forceSync() {
    if (this.isOnline) {
      await this.processPendingUploads();
    }
  }
}
