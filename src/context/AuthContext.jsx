import { createContext, useContext, useMemo } from "react";
import { authClient } from "../lib/auth-client.js";
import { api } from "../lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // authClient.useSession handles loading and automatic re-fetching
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user || null;

  const login = async (email, password) => {
    const res = await authClient.signIn.email({ email, password });
    if (res.error) throw new Error(res.error.message || "Failed to login");
    await authClient.getSession();
    return res.data.user;
  };

  const loginWithGoogle = async () => {
    const res = await authClient.signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}/dashboard`
    });
    if (res.error) throw new Error(res.error.message || "Failed to login with Google");
  };

  const register = async ({ name, email, image, password }) => {
    const res = await authClient.signUp.email({
      email,
      password,
      name,
      image: image || `https://i.pravatar.cc/120?u=${encodeURIComponent(email)}`,
      role: 'user'
    });
    if (res.error) throw new Error(res.error.message || "Failed to register");
    await authClient.getSession();
    return res.data.user;
  };

  const logout = async () => {
    await authClient.signOut();
  };

  const value = useMemo(
    () => ({ user, allUsers: [], isPending, login, loginWithGoogle, register, logout }),
    [user, isPending]
  );
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
