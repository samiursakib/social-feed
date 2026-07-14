"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  authenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<string>;
  logout: () => Promise<void>;
  authFetch: (endpoint: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | null>(null);

class TokenStore {
  token: string | null = null;

  set(token: string | null) {
    this.token = token;
  }
  get() {
    return this.token;
  }
}

const tokenStore = new TokenStore();

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const clearAuthState = useCallback(() => {
    tokenStore.set(null);
    setUser(null);
  }, []);

  const authFetch = useCallback(
    async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
      const headers = new Headers(options.headers);

      const accessToken = tokenStore.get();

      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }

      const config: RequestInit = {
        ...options,
        headers,
        credentials: "include",
      };

      let response = await fetch(endpoint, config);

      if (response.status === 401 && endpoint !== "/api/auth/refresh") {
        try {
          const refreshResponse = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include",
          });

          if (!refreshResponse.ok) {
            clearAuthState();
            router.replace("/login");
            return response;
          }

          const result = await refreshResponse.json();

          tokenStore.set(result.data);

          headers.set("Authorization", `Bearer ${result.data}`);

          response = await fetch(endpoint, {
            ...config,
            headers,
          });
        } catch (err) {
          console.error(err);

          clearAuthState();
          router.replace("/login");
        }
      }

      return response;
    },
    [clearAuthState, router],
  );

  const serverLogout = useCallback(async () => {
    try {
      const response = await authFetch("/api/auth/logout", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const result = await response.json();
      return result;
    } catch (err) {
      throw err;
    }
  }, [authFetch]);

  const fetchCurrentUser = useCallback(async () => {
    const response = await authFetch("/api/auth/me");

    if (!response.ok) {
      throw new Error("Unable to fetch current user.");
    }

    const user = await response.json();

    setUser(user);

    return user;
  }, [authFetch]);

  const login = useCallback(
    async ({ email, password }: LoginCredentials) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Login failed.");
      }

      tokenStore.set(result.data);

      await fetchCurrentUser();

      router.replace("/");

      return result.message as string;
    },
    [fetchCurrentUser, router],
  );

  const logout = useCallback(async () => {
    try {
      const result = await serverLogout();
      toast.success(result.message);
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Logout failed.";
      toast.error(msg);
    } finally {
      clearAuthState();
      router.push("/login");
    }
  }, [serverLogout, clearAuthState, router]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const refreshResponse = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (refreshResponse.status === 401) {
          clearAuthState();

          const publicRoutes = ["/login", "/registration"];
          if (!publicRoutes.includes(pathname)) {
            router.replace("/login");
          }

          return;
        }

        if (!refreshResponse.ok) {
          throw new Error("Failed to initialize authentication.");
        }

        const result = await refreshResponse.json();

        tokenStore.set(result.data);

        await fetchCurrentUser();

        if (pathname === "/login" || pathname === "/registration") {
          router.replace("/");
        }
      } catch (err) {
        console.error("Auth initialization failed:", err);

        clearAuthState();

        const publicRoutes = ["/login", "/registration"];
        if (!publicRoutes.includes(pathname)) {
          router.replace("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [pathname, fetchCurrentUser, clearAuthState, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        authenticated: !!user,
        loading,
        login,
        logout,
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
