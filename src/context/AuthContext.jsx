import { createContext, useCallback, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => localStorage.getItem("token") || "");

  const setToken = useCallback((t) => {
    const next = t || "";
    setTokenState(next);
    if (next) localStorage.setItem("token", next);
    else localStorage.removeItem("token");
  }, []);

  const logout = useCallback(() => setToken(""), [setToken]);

  const value = useMemo(
    () => ({
      token,
      isAuthed: Boolean(token),
      setToken,
      logout,
    }),
    [token, setToken, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
}
