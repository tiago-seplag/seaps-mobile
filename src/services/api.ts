import axios, { AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "toastify-react-native";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  withCredentials: false,
});

api.interceptors.response.use(undefined, async (data: AxiosError<any>) => {
  if (data.response) {
    if (data.response.status === 401) {
      Toast.error("Conta não ativa");
    }
    if (data.response.status === 403) {
      Toast.error("Você não tem permissão para isso");
    }
  }
  return Promise.reject(data);
});

api.interceptors.request.use(async (config) => {
  if (!config.headers.get("Cookie")) {
    const token = await AsyncStorage.getItem("session");
    config.headers["Cookie"] = `session=${token}`;
  }
  return config;
});

export { api };
