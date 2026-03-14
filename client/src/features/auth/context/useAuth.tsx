import { useContext } from "react";
import { AuthContext } from "./AuthContext.tsx";
import type { AuthContextType } from "../../../types/Types.ts";

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
  
}
