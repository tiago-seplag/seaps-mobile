import { api } from "./api";
import { PaginationParams, PaginatedResponse } from "./types";

/**
 * Lista os checklists com paginação
 */
export async function getChecklists(
  params?: PaginationParams
): Promise<PaginatedResponse<Checklist>> {
  const { data } = await api.get<PaginatedResponse<Checklist>>(
    "/api/v1/checklists",
    {
      params: {
        page: 1,
        per_page: 20,
        ...params,
      },
    }
  );
  return data;
}

/**
 * Busca um checklist específico pelo ID
 */
export async function getChecklistById(id: string): Promise<Checklist> {
  const { data } = await api.get<Checklist>(`/api/v1/checklists/${id}`);
  return data;
}

/**
 * Finaliza um checklist
 */
export async function finishChecklist(id: string): Promise<void> {
  await api.put(`/api/v1/checklists/${id}/finish`);
}

/**
 * Reabre um checklist finalizado
 */
export async function reopenChecklist(id: string): Promise<void> {
  await api.post(`/api/v1/checklists/${id}/re-open`);
}

/**
 * Cria um novo checklist
 */
export async function createChecklist(
  data: Partial<Checklist>
): Promise<Checklist> {
  const response = await api.post<Checklist>("/api/v1/checklists", data);
  return response.data;
}
