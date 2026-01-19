import { api } from "./api";
import { LocalStorageService } from "./local-storage.service";

export interface ChecklistItemImage {
  id: string;
  checklist_item_id: string;
  image: string;
  observation: string;
  created_at: string;
}

export interface UpdateChecklistItemData {
  score?: number | null;
  observation?: string;
  image?: string;
}

/**
 * Lista os itens de um checklist, offline-first
 */
export async function getChecklistItems(
  checklistId: string,
): Promise<ChecklistItem[]> {
  // Try local first
  const localData = await LocalStorageService.getChecklistItems(checklistId);
  if (localData) {
    return localData as unknown as ChecklistItem[];
  }

  // Fetch from API
  const { data } = await api.get<ChecklistItem[]>(
    `/api/v1/checklists/${checklistId}/items`,
  );

  // Cache locally
  await LocalStorageService.setChecklistItems(
    checklistId,
    data as unknown as ChecklistItem[],
  );

  return data;
}

/**
 * Busca um item de checklist específico pelo ID, offline-first
 */
export async function getChecklistItemById(
  checklistId: string,
  itemId: string,
): Promise<ChecklistItem> {
  // Try local first
  const localItems = await LocalStorageService.getChecklistItems(checklistId);
  if (localItems) {
    const localItem = localItems.find((item) => item.id === itemId);
    if (localItem) {
      return localItem as unknown as ChecklistItem;
    }
  }

  // Fetch from API
  const { data } = await api.get<ChecklistItem>(
    `/api/v1/checklist-items/${itemId}`,
  );

  // Update local storage
  const current =
    (await LocalStorageService.getChecklistItems(checklistId)) || [];
  const updated = current.filter((item) => item.id !== itemId).concat(data);
  await LocalStorageService.setChecklistItems(checklistId, updated);

  return data;
}

/**
 * Atualiza um item de checklist, offline-first
 */
export async function updateChecklistItem(
  checklistId: string,
  itemId: string,
  updateData: UpdateChecklistItemData,
): Promise<ChecklistItem> {
  // Update locally first
  await LocalStorageService.updateChecklistItemLocally(
    checklistId,
    itemId,
    updateData,
  );

  // Try to sync with API
  try {
    const { data } = await api.put<ChecklistItem>(
      `/api/v1/checklist-items/${itemId}`,
      updateData,
    );
    // Update local with server response
    await LocalStorageService.updateChecklistItemLocally(
      checklistId,
      itemId,
      data,
    );
    return data;
  } catch (error) {
    // If offline, return the local update
    console.warn("Failed to sync update, keeping local changes:", error);
    // Return a mock updated item
    return { id: itemId, ...updateData } as ChecklistItem;
  }
}

/**
 * Faz upload de imagens para um item de checklist, offline-first
 */
export async function uploadChecklistItemImages(
  checklistId: string,
  itemId: string,
  formData: any,
): Promise<void> {
  // Extract file data for storage
  const fileData: any[] = [];
  for (const [key, value] of formData.entries()) {
    if (key === "file") {
      fileData.push({
        uri: (value as any).uri,
        type: (value as any).type,
        name: (value as any).name,
      });
    }
  }

  // Add to pending uploads queue
  await LocalStorageService.addPendingUpload({
    checklistId,
    itemId,
    type: "image_upload",
    data: {
      files: fileData,
      folder: "photos",
    },
  });

  // Try to sync immediately
  try {
    await api.post(`/api/v1/checklist-items/${itemId}/upload`, formData, {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    });
    // If successful, remove from pending (will be handled by sync service)
  } catch (error) {
    console.warn("Upload failed, queued for later sync:", error);
    // Keep in queue for later retry
  }
}

/**
 * Atualiza uma imagem de um item de checklist, offline-first
 */
export async function updateChecklistItemImage(
  checklistId: string,
  itemId: string,
  imageId: string,
  data: { observation?: string },
): Promise<void> {
  // Add to pending uploads queue
  await LocalStorageService.addPendingUpload({
    checklistId,
    itemId,
    type: "image_update",
    data: { imageId, ...data },
  });

  // Try to sync immediately
  try {
    await api.put(`/api/v1/checklist-items/${itemId}/images/${imageId}`, data);
  } catch (error) {
    console.warn("Image update failed, queued for later sync:", error);
  }
}

/**
 * Deleta uma imagem de um item de checklist, offline-first
 */
export async function deleteChecklistItemImage(
  checklistId: string,
  itemId: string,
  imageId: string,
): Promise<void> {
  // Add to pending uploads queue
  await LocalStorageService.addPendingUpload({
    checklistId,
    itemId,
    type: "image_delete",
    data: { imageId },
  });

  // Try to sync immediately
  try {
    await api.delete(`/api/v1/checklist-items/${itemId}/images/${imageId}`);
  } catch (error) {
    console.warn("Image delete failed, queued for later sync:", error);
  }
}
