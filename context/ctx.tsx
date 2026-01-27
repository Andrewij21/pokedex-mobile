import { useStorageState } from "@/hooks/useStorageState";
import React, { createContext, useContext } from "react";

interface UserSession {
  token: string;
  id: string;
  name: string;
  email: string;
}

const AuthContext = createContext<{
  signIn: () => void;
  signOut: () => void;
  session: UserSession | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

export const useSession = () => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }
  return value;
};

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionStr, setSessionStr, isLoading] =
    useStorageState("my-app-session");
  const session: UserSession | null = sessionStr
    ? JSON.parse(sessionStr)
    : null;
  return (
    <AuthContext.Provider
      value={{
        signIn: () => {
          const userData: UserSession = {
            token: "dummy-jwt-token-xyz",
            id: "12345",
            name: "Ash Ketchum",
            email: "ash@pokemon.com",
          };

          // Simpan Object sebagai String JSON
          setSessionStr(JSON.stringify(userData));
        },
        signOut: () => {
          setSessionStr(null);
        },
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
