"use client";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import { setupAPIClient } from "@/services/http/setupAPIClient";

type UserProps = {
  name: string;
  email: string;
  roles: string[];
};

type SignInProps = {
  email: string;
  password: string;
};

type SignUpProps = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone_number: string;
};

type AuthProviderProps = {
  children: ReactNode;
};

type AuthContextData = {
  user: UserProps | undefined;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
  signUp: (credentials: SignUpProps) => Promise<void>;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>();
  const isAuthenticated = !!user;

  const Router = useRouter();

  function signOut() {
    Router.push("/");
    Cookies.remove("nextauth.token");
  }

  useEffect(() => {
    const token = Cookies.get("nextauth.token");

    if (token) {
      setupAPIClient()
        .get("/users/me")
        .then((response) => {
          const { name, email, roles } = response.data;

          setUser({
            name,
            email,
            roles,
          });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function signIn({ email, password }: SignInProps) {
    try {
      const response = await setupAPIClient().post("/session", {
        email,
        password,
      });

      const {
        access_token: token,
        user: { name, roles },
      } = response.data;

      Cookies.set("nextauth.token", token, {
        expires: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });

      setUser({
        roles,
        name,
        email,
      });

      setupAPIClient().defaults.headers["Authorization"] = `Bearer ${token}`;

      Router.push("/private/client/dashboard");
    } catch (err) {}
  }

  async function signUp({
    name,
    email,
    password,
    password_confirmation,
    phone_number,
  }: SignUpProps) {
    try {
      const response = await setupAPIClient().post("/users", {
        name,
        email,
        password,
        password_confirmation,
        phone_number,
      });

      Router.push("/");
    } catch (err) {
      console.log("Erro ao cadastrar ", err);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, signIn, signOut, signUp }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
