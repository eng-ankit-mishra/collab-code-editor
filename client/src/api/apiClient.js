import axios from "axios"

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "https://collab-code-editor-backend-ybyk.onrender.com",
    headers:{
        "Content-Type": "application/json",
    }
})

apiClient.interceptors.request.use(config => {

        if (!config.url.includes('/api/auth/')) {
            let token = localStorage.getItem("token");
            if (token) {
                token = token.replace(/['"]+/g, '').trim();
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    error => Promise.reject(error)
);

apiClient.interceptors.response.use(
    response=>response
    ,error =>{
        if(error.response && error.response.status===401){
            localStorage.removeItem("token");
            window.location.href="/login";
        }
        return Promise.reject(error)
    } )


export default apiClient;