import React, { useEffect } from "react";
import { Button, Image, Text, TouchableOpacity } from "react-native";
import { useSession } from "../../contexts/authContext";
import MtLoginLogo from "../../../assets/mt-login-icon.png";

import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { api } from "../../services/api";
import { Toast } from "toastify-react-native";

WebBrowser.maybeCompleteAuthSession();

const AUTH_URL =
  "https://dev.login.mt.gov.br/auth/realms/mt-realm/protocol/openid-connect/auth";
const TOKEN_URL =
  "https://dev.login.mt.gov.br/auth/realms/mt-realm/protocol/openid-connect/token";

const CLIENT_ID = "projeto-template-integracao"; // Seu client_id
const REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: "ssp",
});

WebBrowser.maybeCompleteAuthSession();

export function MtLogginButton() {
  const { signIn } = useSession();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI,
      responseType: "code",
      scopes: ["openid", "offline_access"],
    },
    { authorizationEndpoint: AUTH_URL }
  );

  async function exchangeCodeForToken(code: string) {
    try {
      const response = await api.post("/api/auth/login?code=" + code, {
        body: new URLSearchParams({ code: code }),
      });

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

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      console.log(code);
      exchangeCodeForToken(code);
    }
  }, [response, request]);

  return (
    <TouchableOpacity
      disabled={!request}
      onPress={() => promptAsync()}
      style={{
        display: "flex",
        padding: 8,
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        backgroundColor: "white",
        alignItems: "center",
        gap: 16,
      }}
    >
      <Text style={{ color: "black", fontWeight: "600" }}>ENTRAR COM</Text>
      <Image
        style={{ height: 50, width: 50, objectFit: "contain" }}
        source={MtLoginLogo}
      />
    </TouchableOpacity>
  );
}
