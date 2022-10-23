import React, { createContext, useCallback, useEffect, useState } from "react";
import * as AuthSession from "expo-auth-session";

import * as AppleAuthentication from "expo-apple-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;

type User = {
  email: string;
  id: string;
  name: string;
  photo: string;
  access_token?: string;
};

type AuthProviderProps = {
  user: User;
  signWithGoogle: () => Promise<void>;
  signWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  storageLoading: boolean;
};

export const AuthProvider = createContext({} as AuthProviderProps);

type AuthContextProviderProps = {
  children: React.ReactNode;
};

type AuthResponse = {
  params: {
    access_token: string;
  };
  type: string;
};

// TODO: Criar exclusão de items de dashboard

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState({} as User);
  const [storageLoading, setStorageLoading] = useState<boolean>(false);
  const userKey = "@gofinances:user";

  const loadUserStorageData = useCallback(async () => {
    try {
      setStorageLoading(true);
      const userStoraged = await AsyncStorage.getItem(userKey);

      if (userStoraged) {
        const userLogged = JSON.parse(userStoraged) as User;
        setUser(userLogged);
      }
    } catch (err) {
      throw new Error("Não há usuário");
    } finally {
      setStorageLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserStorageData();
  }, []);

  async function signWithGoogle() {
    try {
      const RESPONSE_TYPE = "token";
      const SCOPE = encodeURI("profile email");

      const parameters = `client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${parameters}`; // Endpoint auth google

      const { params, type } = (await AuthSession.startAsync({
        authUrl,
      })) as AuthResponse;

      if (type === "success") {
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`
        );
        const useInfo = await response.json();

        const userLogged = {
          email: useInfo.email,
          id: useInfo.id,
          name: useInfo.given_name,
          photo: useInfo.picture,
          access_token: params.access_token,
        };

        setUser(userLogged);
        await AsyncStorage.setItem(userKey, JSON.stringify(userLogged));
      }
    } catch (err) {
      console.log(err);
      throw new Error("");
    }
  }

  async function signWithApple() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential) {
        const name = String(credential.fullName?.givenName);
        const photo = `https://ui-avatars.com/api/?name=${name}&length=1`;

        const userLogged = {
          id: String(credential.user),
          email: String(credential!.email),
          name,
          photo,
        };

        setUser(userLogged);
        await AsyncStorage.setItem(userKey, JSON.stringify(userLogged));
      }
    } catch (err) {
      throw new Error();
    }
  }

  async function signOut() {
    setUser({} as User);
    await AuthSession.revokeAsync(
      {
        token: String(user.access_token),
      },
      { revocationEndpoint: "https://oauth2.googleapis.com/revoke" }
    );

    return await AsyncStorage.removeItem(userKey);
  }

  return (
    <AuthProvider.Provider
      value={{
        user,
        signWithGoogle,
        signWithApple,
        signOut,
        storageLoading,
      }}
    >
      {children}
    </AuthProvider.Provider>
  );
}
