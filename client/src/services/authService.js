import apiClient from "../api/apiClient.js";

const authService = {
    register:(name,email,password)=>apiClient.post("/api/auth/register",{name,email,password}).then((res)=>res.data),
    authenticate:(email,password)=>apiClient.post("/api/auth/authenticate",{email,password}).then((res)=>res.data),
    forgotPassword:(email)=>apiClient.post("/api/auth/forgot-password",{email}).then((res)=>res.data),
    resetPassword:(token,newPassword)=>apiClient.post("/api/auth/reset-password",{token,newPassword}).then((res)=>res.data),
    getUserDetail:()=>apiClient.get("/api/user").then(res=>res.data)
}

export default authService;