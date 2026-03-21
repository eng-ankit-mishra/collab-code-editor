# 🧑‍💻 CoDevSpace – Real-Time Collaborative Code Editor & Execution Engine

CoDevSpace is a high-performance, real-time collaborative coding platform. Moving beyond standard web sockets, this application utilizes a dual-brain microservice architecture: a **Spring Boot** backend handling core business logic, secure JWT authentication, and in-browser code compilation via Judge0, alongside a dedicated **Node.js** WebSocket server using **Yjs CRDTs** for sub-50ms, zero-conflict code syncing.

Built for seamless team collaboration, execution, and developer experience.

---

## 🌟 Core Features

- 🧠 **Conflict-Free Collaboration:** Real-time multi-user code syncing powered by Yjs CRDTs and WebSockets.
- ⚙️ **Live Code Execution:** Secure, sandboxed code compilation across 8+ programming languages via the Judge0 API.
- 🔒 **Enterprise-Grade Security:** Custom JWT authentication, session management, and role-based access control built from the ground up with Spring Security.
- 💬 **Live Project Chat:** Dedicated STOMP WebSocket broker routing real-time messaging between collaborators.
- 🚀 **Cloud-Native Deployment:** Fully containerized 3-tier architecture deployed to an AWS EC2 instance via an automated GitHub Actions CI/CD pipeline.
- 💾 **Optimized Storage:** Persistent session data and chat logs managed by MongoDB with O(1) retrieval time.

---

## 🛠️ Tech Stack

**Frontend:** `React` · `TypeScript` · `Tailwind CSS` · `Vite` · `Monaco Editor`  

**Backend (Microservices):** `Java / Spring Boot` (Core API, Auth, Chat Broker)  
`Node.js` (Yjs CRDT WebSocket Server)  

**Database & APIs:** `MongoDB` · `Judge0 API` 

**DevOps & Infrastructure:** `Docker` · `Docker Compose` · `AWS EC2` · `GitHub Actions`

---

## 🚀 Live Demo

🔗 **Live Application:** [codevspace.codes](https://codevspace.codes/)  
🔗 **GitHub Repository:** [github.com/eng-ankit-mishra/collab-code-editor](https://github.com/eng-ankit-mishra/collab-code-editor)

---

## 📸 Screenshots
 
> ![Home Page Screenshot](/client/src/assets/home.png)
*(Feel free to update this image path to a screenshot of the new live editor!)*

---

## 🧪 How to Run Locally

Because CoDevSpace utilizes a microservice architecture, the easiest way to run the entire stack locally is via Docker Compose.

```bash
# 1. Clone the repository
git clone [https://github.com/eng-ankit-mishra/collab-code-editor.git](https://github.com/eng-ankit-mishra/collab-code-editor.git)
cd collab-code-editor

# 2. Add your environment variables
# Create a .env file in the root or respective backend/client folders 
# (You will need your MongoDB URI, JWT Secret, and Judge0 URL)

# 3. Build and spin up all microservices and databases
docker-compose up --build

# The application will be available at:
# Frontend: http://localhost:5173
# Spring Boot API: http://localhost:8080
# Yjs WebSocket Server: ws://localhost:1234
