import { api } from "./api";
import { PaginationParams, PaginatedResponse } from "./types";
import { LocalStorageService } from "./local-storage.service";

/**
 * Lista os checklists com paginação, offline-first
 */
export async function getChecklists(
  params?: PaginationParams,
  forceRefresh = false,
) {
  if (!forceRefresh) {
    // Try to get from local storage first
    const localData = await LocalStorageService.getChecklists();
    if (localData) {
      // Return local data immediately
      return {
        data: localData,
        meta: {
          total: localData.length,
          per_page: 20,
          current_page: 1,
          last_page: 1,
        },
      };
    }
  }

  // Fetch from API and cache
  const response = await api.get<PaginatedResponse<Checklist>>(
    "/api/v2/checklists",
    {
      params: {
        page: 1,
        per_page: 20,
        ...params,
      },
    },
  );

  // Cache the data
  await LocalStorageService.setChecklists(response.data.data);

  return response.data;
}

/**
 * Busca um checklist específico pelo ID, offline-first
 */
export async function getChecklistById(id: string): Promise<Checklist> {
  // Try to get from local storage first
  const localChecklists = await LocalStorageService.getChecklists();
  if (localChecklists) {
    const localChecklist = localChecklists.find((c) => c.id === id);
    if (localChecklist) {
      return localChecklist;
    }
  }

  // Fetch from API
  const { data } = await api.get<Checklist>(`/api/v2/checklists/${id}`);

  // Update local storage
  const current = (await LocalStorageService.getChecklists()) || [];
  const updated = current.filter((c) => c.id !== id).concat(data);
  await LocalStorageService.setChecklists(updated);

  return data;
}

/**
 * Finaliza um checklist
 */
export async function finishChecklist(id: string): Promise<void> {
  await api.put(`/api/v2/checklists/${id}/finish`);
}

/**
 * Reabre um checklist finalizado
 */
export async function reopenChecklist(id: string): Promise<void> {
  await api.post(`/api/v2/checklists/${id}/re-open`);
}

/**
 * Cria um novo checklist
 */
export async function createChecklist(
  data: Partial<Checklist>,
): Promise<Checklist> {
  const response = await api.post<Checklist>("/api/v2/checklists", data);
  return response.data;
}
