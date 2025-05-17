import React, { useEffect, useState } from "react";
import { useStorageState } from "../hooks/useAsyncState";
import { api } from "../services/api";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

const AuthContext = React.createContext<{
  signIn: (session: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: (session: string) => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

const LOGOUT_URL =
  "https://login.mt.gov.br/auth/realms/mt-realm/protocol/openid-connect/logout";

const CLIENT_ID = "seplag-manutencao-predial";

const AUTH_URL =
  "https://login.mt.gov.br/auth/realms/mt-realm/protocol/openid-connect/logout";

const REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: "smp",
  path: "redirect",
});

export function useSession() {
  const value = React.useContext(AuthContext);
  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");

  const [, , promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI,
      responseType: "code",
    },
    {
      authorizationEndpoint: AUTH_URL,
      endSessionEndpoint: LOGOUT_URL,
    }
  );

  useEffect(() => {
    if (session !== null) {
      api.defaults.headers.common["Cookie"] = "SESSION=" + session;
    }
  }, [session]);

  return (
    <AuthContext.Provider
      value={{
        signIn: (string) => {
          api.defaults.headers.common["Cookie"] = "SESSION=" + string;
          setSession(string);
        },
        signOut: async () => {
          await promptAsync({ url: LOGOUT_URL + "?client_id=" + CLIENT_ID });
          setSession(null);
          delete api.defaults.headers.common["Cookie"];
        },
        session,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
