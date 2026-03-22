import NavBar from "../../../components/layout/NavBar.tsx";
import { useState, useEffect } from "react";
import Modals from "../components/Modals.tsx";
import type { ProjectDetails,DashboardProjects } from "../../../types/Types.ts";
import { useAuth } from "../../auth/context/useAuth.tsx";
import Menu from "../../../components/layout/Menu.tsx";
import { Outlet} from "react-router-dom";

import SplashScreen from "../../../components/loader/PageScreenLoader.tsx";
// @ts-ignore
import projectService from "../../../services/projectService.js"

export default function Dashboard() {
  const [showModals, setShowModals] = useState(false);
  const [projects, setProjects] = useState<DashboardProjects[]>([]);
  const [loading, setLoading] = useState(true);

  const { session } = useAuth();


  useEffect(() => {
    if (!session) return;

    const fetchProjects = async () => {
      setLoading(true);
      try {
        const data= await projectService.getAllProject()
        const sortedProjects = [...data].sort((a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        setProjects(sortedProjects);
      } catch (err) {
        console.error("Fetch failed:", err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchProjects();
  }, [session]);

  async function handleCreate(project: ProjectDetails) {
    try {
      const data = await projectService.createProject(project)
      console.log(data)
      setProjects((prev) => [...prev, data]);
      return data.id;
    } catch (err) {
      console.error("Create project failed:", err);
      throw err;
    }
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
          projects,
          loading,
          setShowModals,
          setProjects
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
