import React, { useEffect } from "react";
import { Button } from "react-native";
import { useSession } from "../../contexts/authContext";
import { SafeAreaView } from "react-native-safe-area-context";

import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

const AUTH_URL =
  "https://dev.login.mt.gov.br/auth/realms/mt-realm/protocol/openid-connect/auth";
const TOKEN_URL =
  "https://dev.login.mt.gov.br/auth/realms/mt-realm/protocol/openid-connect/token";

const CLIENT_ID = "projeto-template-integracao"; // Seu client_id
const REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: "http",
});

export function Login() {
  const { signIn } = useSession();

  console.log(REDIRECT_URI);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri: "http://172.16.146.58:8081",
      responseType: "code",
      state: "f7fa50c1-cd43-48f0-a2ed-da08434825f7",
      scopes: ["openid", "offline_access"],
    },
    { authorizationEndpoint: AUTH_URL }
  );

  async function exchangeCodeForToken(code: string) {
    console.log("code,", code);

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      code,
    });

    try {
      const res = await fetch(TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      const data = await res.json();

      if (data.access_token) {
        signIn(data.access_token);
      } else {
        console.error("Erro ao obter o token:", data);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  }

  useEffect(() => {
    console.log("response", response);
    console.log("request", request);

    if (response?.type === "success") {
      const { code } = response.params;
      exchangeCodeForToken(code);
    }
  }, [response, request]);

  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Button title="Login" disabled={!request} onPress={() => promptAsync()} />
      {/* <WebView
        source={{
          uri: "http://172.16.146.58:3000/login",
        }}
        onMessage={onMessage}
        pullToRefreshEnabled
        sharedCookiesEnabled={false}
        cacheEnabled={false}
        bounces={false}
      /> */}
    </SafeAreaView>
  );
}
