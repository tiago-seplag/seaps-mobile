import axios, { AxiosError } from "axios";

const api = axios.create({ baseURL: process.env.EXPO_PUBLIC_API_URL });

api.interceptors.response.use(undefined, async (data: AxiosError<any>) => {
  if (data.response) {
    if (data.response.status === 403) {
    }
  }
  return Promise.reject(data);
});

export { api };
