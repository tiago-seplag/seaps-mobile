import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { useSession } from "../contexts/authContext";
import { Toast } from "toastify-react-native";
import { api } from "../services/api";

const CLIENT_ID = "seplag-manutencao-predial";

const AUTH_URL =
  "https://login.mt.gov.br/auth/realms/mt-realm/protocol/openid-connect/auth";

const LOGOUT_URL =
  "https://login.mt.gov.br/auth/realms/mt-realm/protocol/openid-connect/logout";

const REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: "smp",
  path: "redirect",
});

const useMTLogin = () => {
  const { signIn } = useSession();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI,
      responseType: "code",
      scopes: ["openid", "offline_access"],
    },
    { authorizationEndpoint: AUTH_URL, endSessionEndpoint: LOGOUT_URL }
  );

  async function exchangeCodeForToken(code: string) {
    try {
      const response = await api.post(
        "/api/auth/login?code=" +
          code +
          "&redirect_uri=" +
          REDIRECT_URI +
          "&code_verifier=" +
          request?.codeVerifier,
        {
          body: new URLSearchParams({ code: code }),
        }
      );

      if (response?.data.SESSION) {
        signIn(response.data.SESSION);
      } else {
        Toast.error(
          "Erro ao fazer login pelo MT-Cidadão, tente novamente mais tarde."
        );
      }
    } catch (error) {
      Toast.error(
        "Erro ao fazer login pelo MT-Cidadão, tente novamente mais tarde."
      );
    }
  }
};
