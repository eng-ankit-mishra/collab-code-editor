import axios from "axios"

const apiClient = axios.create({
    baseURL: "",
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