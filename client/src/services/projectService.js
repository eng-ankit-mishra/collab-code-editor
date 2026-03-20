import apiClient from "../api/apiClient.js";

const projectService={
    createProject:({name,description,language,codeContent})=>apiClient.post("/api/projects",{name,description,language,codeContent}).then(res=>res.data),
    getAllProject:()=>apiClient.get("/api/projects").then(res=>res.data),
    getProjectById:(id)=>apiClient.get(`/api/projects/${id}`).then(res=>res.data),
    saveCode:(projectId,codeContent)=>apiClient.patch(`/api/projects/${projectId}/code`,{codeContent}).then(res=>res.data),
    executeCode:(projectId,{languageId,sourceCode,stdin})=>apiClient.post(`/api/projects/${projectId}/execute`,{languageId,sourceCode,stdin}).then(res=>res.data),
    sharedProject:()=>apiClient.get("/api/projects/shared").then(res=>res.data),
    inviteUser:(projectId,email,role)=>apiClient.post(`/api/projects/${projectId}/invite`,{email,role}).then(res=>res.data),
    getAllInvitations:()=>apiClient.get("/api/projects/invitations").then(res=>res.data),
    respondToInvitation:(projectId,accept)=>apiClient.post(`/api/projects/${projectId}/invitations/respond`,{accept}).then(res=>res.data),
    getAllLanguages:()=>apiClient.get("/api/projects/languages").then(res=>res.data),
}

export default projectService;