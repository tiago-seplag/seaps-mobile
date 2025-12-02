import { api } from "./api";

export interface ChecklistItem {
  id: string;
  checklist_id: string;
  item_id: string;
  score: number | null;
  observation: string | null;
  image: string | null;
  is_inspected: boolean;
  created_at: string;
  updated_at: string;
  item?: {
    name: string;
  };
  images?: ChecklistItemImage[];
}

export interface ChecklistItemImage {
  id: string;
  checklist_item_id: string;
  image: string;
  observation: string;
  created_at: string;
}

export interface UpdateChecklistItemData {
  score?: string | number;
  observation?: string;
  image?: string;
}

/**
 * Lista os itens de um checklist
 */
export async function getChecklistItems(
  checklistId: string
): Promise<ChecklistItem[]> {
  const { data } = await api.get<ChecklistItem[]>(
    `/api/v1/checklists/${checklistId}/items`
  );
  return data;
}

/**
 * Busca um item de checklist específico pelo ID
 */
export async function getChecklistItemById(
  itemId: string
): Promise<ChecklistItem> {
  const { data } = await api.get<ChecklistItem>(
    `/api/v1/checklist-items/${itemId}`
  );
  return data;
}

/**
 * Atualiza um item de checklist
 */
export async function updateChecklistItem(
  itemId: string,
  updateData: UpdateChecklistItemData
): Promise<ChecklistItem> {
  const { data } = await api.put<ChecklistItem>(
    `/api/v1/checklist-items/${itemId}`,
    updateData
  );
  return data;
}

/**
 * Faz upload de imagens para um item de checklist
 */
export async function uploadChecklistItemImages(
  checklistId: string,
  itemId: string,
  formData: FormData
): Promise<void> {
  await api.post(`/api/v1/checklist-items/${itemId}/upload`, formData, {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * Atualiza uma imagem de um item de checklist
 */
export async function updateChecklistItemImage(
  itemId: string,
  imageId: string,
  data: { observation?: string }
): Promise<void> {
  await api.put(`/api/v1/checklist-items/${itemId}/images/${imageId}`, data);
}

/**
 * Deleta uma imagem de um item de checklist
 */
export async function deleteChecklistItemImage(
  itemId: string,
  imageId: string
): Promise<void> {
  await api.delete(`/api/v1/checklist-items/${itemId}/images/${imageId}`);
}
