import { api } from "./api";
import { PaginatedResponse } from "./types";

export interface Model {
  id: string;
  name: string;
  // Adicione outros campos conforme necessário
}

/**
 * Lista os modelos de checklist
 */
export async function getModels(): Promise<PaginatedResponse<Model>> {
  const { data } = await api.get<PaginatedResponse<Model>>("/api/v1/models");
  return data;
}

/**
 * Busca um modelo específico pelo ID
 */
export async function getModelById(id: string): Promise<Model> {
  const { data } = await api.get<Model>(`/api/v1/models/${id}`);
  return data;
}
