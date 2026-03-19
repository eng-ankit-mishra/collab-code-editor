import {useEffect, useState} from "react";
import { AuthContext } from "./AuthContext.tsx";
// @ts-ignore
import authService from "../../../services/authService";
// @ts-ignore
import type {UserDetail} from "../../../types.tsx"



export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<string | null>(() => {
        return localStorage.getItem("token");
    });
    const [userDetail,setUserDetail] = useState<UserDetail | null>(null);

    useEffect(() => {
        if(!session){
            setUserDetail(null);
            return;
        }
        const userData=async ()=>{
            try{
                const data=await authService.getUserDetail();
                setUserDetail(data)
            }catch(err){
                console.log(err)
            }
        }
        void userData();
    }, [session]);

  const login=(token:string)=>{
      localStorage.setItem("token",token);
    setSession(token);
  }

  const logout=()=>{
      localStorage.removeItem("token");
    setSession(null);
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        login,
        logout,
          userDetail
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
