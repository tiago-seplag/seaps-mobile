import { api } from "./api";
import { PaginatedResponse } from "./types";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
  // Adicione outros campos conforme necessário
}

export interface GetUsersParams {
  role?: string;
  page?: number;
  per_page?: number;
}

/**
 * Lista os usuários com filtros opcionais
 */
export async function getUsers(
  params?: GetUsersParams
): Promise<PaginatedResponse<AppUser>> {
  const { data } = await api.get<PaginatedResponse<AppUser>>("/api/v1/users", {
    params,
  });
  return data;
}

/**
 * Busca um usuário específico pelo ID
 */
export async function getUserById(id: string): Promise<AppUser> {
  const { data } = await api.get<AppUser>(`/api/v1/users/${id}`);
  return data;
}
