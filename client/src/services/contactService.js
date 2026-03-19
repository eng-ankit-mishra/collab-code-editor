import apiClient from "../api/apiClient.js";

const contactService={
    contact:(formData)=>apiClient.post("/api/contact",formData).then(res=>res.data)
}

export default contactService;