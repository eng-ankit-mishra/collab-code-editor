import { createContext } from "react";
import type { AuthContextType } from "../../../types/Types.ts";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
