import NavBar from "../../../components/layout/NavBar.tsx";
import { useState, useEffect } from "react";
import Modals from "../components/Modals.tsx";
import type { ProjectDetails } from "../../../types/Types.ts";
import axios from "axios";
import { useAuth } from "../../auth/context/useAuth.tsx";
import Menu from "../../../components/layout/Menu.tsx";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SplashScreen from "../../../components/loader/PageScreenLoader.tsx";

export default function Dashboard() {
  const [showModals, setShowModals] = useState(false);
  const [project, setProject] = useState<ProjectDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const { session } = useAuth();
  const accessToken = session?.access_token;

  const location = useLocation();
  const navigate = useNavigate();

  /* =========================
     TOAST HANDLING
     ========================= */
  useEffect(() => {
    const toastType = location.state?.showToast;
    if (!toastType) return;

    const messages: Record<string, string> = {
      SignIn: "Successfully Logged in!",
      SignUp: "Successfully Signed up!",
      PasswordChanged: "Successfully Changed Password!",
    };

    toast.success(messages[toastType]);
    navigate(location.pathname, { replace: true });
  }, [location, navigate]);

  /* =========================
     FETCH PROJECTS
     ========================= */
  useEffect(() => {
    if (!accessToken) return;

    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://codevspace-aqhw.onrender.com/api/projects",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await res.json();
        setProject(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch failed:", err);
        setProject([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [accessToken]);

  /* =========================
     CREATE PROJECT
     ========================= */
  async function handleCreate(project: ProjectDetails) {
    try {
      const response = await axios.post(
        "https://codevspace-aqhw.onrender.com/api/projects",
        project,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const newProject = response.data;
      setProject((prev) => [...prev, newProject]);
      return newProject._id;
    } catch (err) {
      console.error("Create project failed:", err);
    }
  }

  /* =========================
     UI HELPERS
     ========================= */
  function handleDelete(_id: string) {
    setProject((prev) => prev.filter((p) => p._id !== _id));
  }

  function handleRename(_id: string | undefined, projectName: string) {
    setProject((prev) =>
      prev.map((p) =>
        p._id === _id ? { ...p, projectName } : p
      )
    );
  }

  return (
    <section className="h-screen w-full flex flex-col bg-gradient-to-br from-[#0a0a0a] to-[#000000] text-white">
      <NavBar authRequired={true} />

      <div className="flex flex-1">
        <Menu setShowModals={setShowModals} />

        <main className="ml-52 pt-14 bg-neutral-950 flex-1 overflow-y-auto">
  {loading ? (
    <SplashScreen />
  ) : (
    <>
      <Outlet
        context={{
          project,
          loading,
          setShowModals,
          handleDelete,
          handleRename,
        }}
      />
    </>
  )}
</main>

      </div>

      {showModals && (
        <Modals
          setShowModals={setShowModals}
          create={handleCreate}
        />
      )}
    </section>
  );
}
