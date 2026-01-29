import { useStorageState } from "@/hooks/useStorageState";
import { setToken } from "@/utils/api";
import React, { createContext, useContext, useEffect } from "react";

interface UserSession {
  token: string;
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

const AuthContext = createContext<{
  setSession: (data: UserSession) => void;
  clearSession: () => void;
  session: UserSession | null;
  isLoading: boolean;
}>({
  setSession: () => null,
  clearSession: () => null,
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
  const [sessionStr, setSessionStr, isLoading] = useStorageState("session");
  const session: UserSession | null = sessionStr
    ? JSON.parse(sessionStr)
    : null;
  useEffect(() => {
    if (session?.token) {
      setToken(session.token);
    } else {
      setToken(null);
    }
  }, [session]);
  return (
    <AuthContext.Provider
      value={{
        setSession: (data: UserSession) => {
          setSessionStr(JSON.stringify(data));
        },
        clearSession: () => {
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
