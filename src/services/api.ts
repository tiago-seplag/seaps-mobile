import axios, { AxiosError } from "axios";
import { setStorageItemAsync } from "../hooks/useAsyncState";

const api = axios.create({ baseURL: "http://172.16.146.58:3000" });

api.interceptors.response.use(undefined, async (data: AxiosError<any>) => {
  if (data.response) {
    if (data.response.status === 403) {
      await setStorageItemAsync("session", null);
    }
  }
  return Promise.reject(data);
});

export { api };
