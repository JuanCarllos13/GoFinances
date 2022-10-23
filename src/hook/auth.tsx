import React, { useContext } from "react";
import { AuthProvider } from "../contexts/AuthContext";

export function useAuth() {
  const context = useContext(AuthProvider);

  return context;
}
