import { api } from "./api";
import { PaginationParams, PaginatedResponse } from "./types";

export interface Organization {
  id: string;
  name: string;
  // Adicione outros campos conforme necessário
}

/**
 * Lista as organizações com paginação
 */
export async function getOrganizations(
  params?: PaginationParams
): Promise<PaginatedResponse<Organization>> {
  const { data } = await api.get<PaginatedResponse<Organization>>(
    "/api/v1/organizations",
    {
      params: {
        page: 1,
        per_page: 100,
        ...params,
      },
    }
  );
  return data;
}

/**
 * Busca uma organização específica pelo ID
 */
export async function getOrganizationById(id: string): Promise<Organization> {
  const { data } = await api.get<Organization>(`/api/v1/organizations/${id}`);
  return data;
}
