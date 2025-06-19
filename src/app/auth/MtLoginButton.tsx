import React, { useEffect } from "react";
import { Image, Text, TouchableOpacity } from "react-native";
import { useSession } from "../../contexts/authContext";
import MtLoginLogo from "../../../assets/mt-login-icon.png";

import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { api } from "../../services/api";
import { Toast } from "toastify-react-native";

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = process.env.EXPO_PUBLIC_CLIENT_ID;

const AUTH_URL =
  process.env.EXPO_PUBLIC_LOGIN_URL +
  "/realms/mt-realm/protocol/openid-connect/auth";

const REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: "smp",
  path: "redirect",
});

export function MtLogginButton() {
  const { signIn } = useSession();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI,
      responseType: "code",
      scopes: ["offline_access", "openid"],
    },
    {
      authorizationEndpoint: AUTH_URL,
    }
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

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
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
      <Text style={{ color: "black", fontWeight: "bold" }}>ENTRAR COM</Text>
      <Image
        style={{ height: 50, width: 50, objectFit: "contain" }}
        source={MtLoginLogo}
      />
    </TouchableOpacity>
  );
}
