import React, { useEffect, useState } from "react";
import { useStorageState } from "../hooks/useAsyncState";
import { api } from "../services/api";

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

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");

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
        signOut: () => {
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
