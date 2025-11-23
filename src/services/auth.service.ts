import { api } from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  // Adicione outros campos conforme necessário
}

/**
 * Busca os dados do usuário autenticado
 */
export async function getUserData(): Promise<User> {
  const { data } = await api.get<User>("/api/v1/auth/me");
  return data;
}
