import axios, { AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  withCredentials: false,
});

api.interceptors.response.use(undefined, async (data: AxiosError<any>) => {
  if (data.response) {
    if (data.response.status === 403) {
    }
  }
  return Promise.reject(data);
});

api.interceptors.request.use(async (config) => {
  if (!config.headers.get("Cookie")) {
    const token = await AsyncStorage.getItem("session");
    config.headers["Cookie"] = `SESSION=${token}`;
  }
  return config;
});

export { api };
