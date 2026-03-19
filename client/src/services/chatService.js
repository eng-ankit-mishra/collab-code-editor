import apiClient from "../api/apiClient.js";

const chatService={
    sendMessage:(projectId,content)=>apiClient.post(`/api/projects/${projectId}/chat`,{content}).then(res=>res.data),
    getAllChatHistory:(projectId)=>apiClient.get(`/api/projects/${projectId}/chat`).then(res=>res.data),
}

export default chatService;