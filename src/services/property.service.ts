import { api } from "./api";
import { PaginationParams, PaginatedResponse } from "./types";

/**
 * Lista as propriedades com paginação
 */
export async function getProperties(
  params?: PaginationParams
): Promise<PaginatedResponse<Property>> {
  const { data } = await api.get<PaginatedResponse<Property>>(
    "/api/v1/properties",
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
 * Busca uma propriedade específica pelo ID
 */
export async function getPropertyById(id: string): Promise<Property> {
  const { data } = await api.get<Property>(`/api/v1/properties/${id}`);
  return data;
}

/**
 * Cria uma nova propriedade
 */
export async function createProperty(
  data: Partial<Property>
): Promise<Property> {
  const response = await api.post<Property>("/api/v1/properties", data);
  return response.data;
}

/**
 * Atualiza uma propriedade existente
 */
export async function updateProperty(
  id: string,
  data: Partial<Property>
): Promise<Property> {
  const response = await api.put<Property>(`/api/v1/properties/${id}`, data);
  return response.data;
}

/**
 * Deleta uma propriedade
 */
export async function deleteProperty(id: string): Promise<void> {
  await api.delete(`/api/v1/properties/${id}`);
}
