import React, { useEffect, useState } from "react";
import { useStorageState } from "../hooks/useAsyncState";
import { api } from "../services/api";
import { ActivityIndicator, View } from "react-native";
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
  process.env.EXPO_PUBLIC_LOGIN_URL +
  "/realms/mt-realm/protocol/openid-connect/logout";

const CLIENT_ID = process.env.EXPO_PUBLIC_CLIENT_ID;

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
      endSessionEndpoint: LOGOUT_URL,
    }
  );

  const getData = async () => {
    try {
      const { data } = await api.get("/api/v1/auth/me");
      setUser(data);
    } catch (error) {
      setSession(null);
    } finally {
    }
  };

  useEffect(() => {
    if (session) {
      getData();
    }
  }, [session]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1A3180",
        }}
      >
        <ActivityIndicator size={"large"} color={"white"} />
      </View>
    );
  }

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

export function useIsSignedIn() {
  const isSignedIn = React.useContext(AuthContext);
  return Boolean(isSignedIn.session);
}

export function useIsSignedOut() {
  return !useIsSignedIn();
}
