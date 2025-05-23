import React, { useEffect, useState } from "react";
import { useStorageState } from "../hooks/useAsyncState";
import { api } from "../services/api";
import * as AuthSession from "expo-auth-session";

const AuthContext = React.createContext<{
  user: any;
  signIn: (session: string) => void;
  signOut: () => void;
  refreshUserData: () => Promise<void>;
  session?: string | null;
  isLoading: boolean;
}>({
  user: null,
  signIn: (session: string) => null,
  signOut: () => null,
  refreshUserData: async () => {},
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
  const [user, setUser] = useState();
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

  const getData = async () => {
    api
      .get("/api/auth/me")
      .then(({ data }) => setUser(data))
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    if (session) {
      getData();
    }
  }, [session]);

  return (
    <AuthContext.Provider
      value={{
        signIn: (string) => {
          setSession(string);
        },
        signOut: async () => {
          await promptAsync({ url: LOGOUT_URL + "?client_id=" + CLIENT_ID });
          setSession(null);
          delete api.defaults.headers.common["Cookie"];
        },
        refreshUserData: getData,
        session,
        isLoading,
        user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
