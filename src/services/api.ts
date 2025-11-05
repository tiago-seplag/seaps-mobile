import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "toastify-react-native";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  withCredentials: false,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.messages?.length > 0) {
      error.response.data.messages.map((msg: string) => Toast.error(msg));
    } else if (error.response?.data?.message) {
      Toast.error(error.response.data.action);
    } else {
      Toast.error("Erro ao tentar processar a requisição. Tente novamente.");
    }

    return Promise.reject(error);
  }
);

api.interceptors.request.use(async (config) => {
  if (!config.headers.get("Cookie")) {
    const token = await AsyncStorage.getItem("session");
    config.headers["Cookie"] = `session=${token}`;
  }
  return config;
});

export { api };
