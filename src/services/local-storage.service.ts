import AsyncStorage from '@react-native-async-storage/async-storage';

const CHECKLISTS_KEY = 'checklists';
const CHECKLIST_ITEMS_KEY = 'checklist_items_';
const PENDING_UPLOADS_KEY = 'pending_uploads';
const PENDING_UPDATES_KEY = 'pending_updates';

export interface CachedChecklist {
  id: string;
  data: Checklist;
  timestamp: number;
}

export interface CachedChecklistItems {
  checklistId: string;
  data: ChecklistItem[];
  timestamp: number;
}

export interface PendingUpload {
  id: string;
  checklistId: string;
  itemId: string;
  type: 'image_upload' | 'image_update' | 'image_delete';
  data: any;
  timestamp: number;
  retryCount: number;
}

export interface PendingUpdate {
  id: string;
  checklistId: string;
  itemId: string;
  data: any;
  timestamp: number;
  retryCount: number;
}

export class LocalStorageService {
  static async getChecklists(): Promise<Checklist[] | null> {
    try {
      const data = await AsyncStorage.getItem(CHECKLISTS_KEY);
      if (data) {
        const parsed: CachedChecklist[] = JSON.parse(data);
        return parsed.map(c => c.data);
      }
      return null;
    } catch (error) {
      console.error('Error getting checklists from local storage:', error);
      return null;
    }
  }

  static async setChecklists(checklists: Checklist[]): Promise<void> {
    try {
      const cached: CachedChecklist[] = checklists.map(c => ({
        id: c.id,
        data: c,
        timestamp: Date.now(),
      }));
      await AsyncStorage.setItem(CHECKLISTS_KEY, JSON.stringify(cached));
    } catch (error) {
      console.error('Error setting checklists to local storage:', error);
    }
  }

  static async getChecklistItems(checklistId: string): Promise<ChecklistItem[] | null> {
    try {
      const data = await AsyncStorage.getItem(CHECKLIST_ITEMS_KEY + checklistId);
      if (data) {
        const parsed: CachedChecklistItems = JSON.parse(data);
        return parsed.data;
      }
      return null;
    } catch (error) {
      console.error('Error getting checklist items from local storage:', error);
      return null;
    }
  }

  static async setChecklistItems(checklistId: string, items: ChecklistItem[]): Promise<void> {
    try {
      const cached: CachedChecklistItems = {
        checklistId,
        data: items,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(CHECKLIST_ITEMS_KEY + checklistId, JSON.stringify(cached));
    } catch (error) {
      console.error('Error setting checklist items to local storage:', error);
    }
  }

  static async updateChecklistItemLocally(checklistId: string, itemId: string, updates: Partial<ChecklistItem>): Promise<void> {
    try {
      const items = await this.getChecklistItems(checklistId);
      if (items) {
        const updatedItems = items.map(item =>
          item.id === itemId ? { ...item, ...updates } : item
        );
        await this.setChecklistItems(checklistId, updatedItems);
      }
    } catch (error) {
      console.error('Error updating checklist item locally:', error);
    }
  }

  static async addPendingUpload(upload: Omit<PendingUpload, 'id' | 'timestamp' | 'retryCount'>): Promise<string> {
    try {
      const pending = await this.getPendingUploads();
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const newUpload: PendingUpload = {
        ...upload,
        id,
        timestamp: Date.now(),
        retryCount: 0,
      };
      pending.push(newUpload);
      await AsyncStorage.setItem(PENDING_UPLOADS_KEY, JSON.stringify(pending));
      return id;
    } catch (error) {
      console.error('Error adding pending upload:', error);
      throw error;
    }
  }

  static async getPendingUploads(): Promise<PendingUpload[]> {
    try {
      const data = await AsyncStorage.getItem(PENDING_UPLOADS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting pending uploads:', error);
      return [];
    }
  }

  static async removePendingUpload(id: string): Promise<void> {
    try {
      const pending = await this.getPendingUploads();
      const filtered = pending.filter(upload => upload.id !== id);
      await AsyncStorage.setItem(PENDING_UPLOADS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing pending upload:', error);
    }
  }

  static async incrementRetryCount(id: string): Promise<void> {
    try {
      const pending = await this.getPendingUploads();
      const upload = pending.find(u => u.id === id);
      if (upload) {
        upload.retryCount += 1;
        await AsyncStorage.setItem(PENDING_UPLOADS_KEY, JSON.stringify(pending));
      }
    } catch (error) {
      console.error('Error incrementing retry count:', error);
    }
  }

  // Pending Updates (for score/observation changes)
  static async addPendingUpdate(update: Omit<PendingUpdate, 'id' | 'timestamp' | 'retryCount'>): Promise<string> {
    try {
      const pending = await this.getPendingUpdates();
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const newUpdate: PendingUpdate = {
        ...update,
        id,
        timestamp: Date.now(),
        retryCount: 0,
      };
      pending.push(newUpdate);
      await AsyncStorage.setItem(PENDING_UPDATES_KEY, JSON.stringify(pending));
      return id;
    } catch (error) {
      console.error('Error adding pending update:', error);
      throw error;
    }
  }

  static async getPendingUpdates(): Promise<PendingUpdate[]> {
    try {
      const data = await AsyncStorage.getItem(PENDING_UPDATES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting pending updates:', error);
      return [];
    }
  }

  static async removePendingUpdate(id: string): Promise<void> {
    try {
      const pending = await this.getPendingUpdates();
      const filtered = pending.filter(update => update.id !== id);
      await AsyncStorage.setItem(PENDING_UPDATES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing pending update:', error);
    }
  }

  static async incrementUpdateRetryCount(id: string): Promise<void> {
    try {
      const pending = await this.getPendingUpdates();
      const update = pending.find(u => u.id === id);
      if (update) {
        update.retryCount += 1;
        await AsyncStorage.setItem(PENDING_UPDATES_KEY, JSON.stringify(pending));
      }
    } catch (error) {
      console.error('Error incrementing update retry count:', error);
    }
  }
}