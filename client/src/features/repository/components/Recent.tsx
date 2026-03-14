import { useEffect, useState } from "react";
import Button from "../../../components/ui/Button.tsx";
import RecentCard from "./RecentCard.tsx";
import SplashScreen from "../../../components/loader/PageScreenLoader.tsx";
import { PlusCircle } from "lucide-react";
import { useAuth } from "../../auth/context/useAuth.tsx";
import type { ProjectDetails } from "../../../types/Types.ts";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutlet } from "../../../types/Types.ts";

export default function Recent() {
  const { session } = useAuth();
  const { setShowModals } =
    useOutletContext<DashboardOutlet>();

  const [projects, setProjects] =
    useState<ProjectDetails[]>([]);
  const [loading, setLoading] = useState(true);

  /* ===============================
     FETCH RECENT PROJECTS
     =============================== */
  useEffect(() => {
    if (!session?.access_token) return;

    setLoading(true);

    fetch(
      "https://codevspace-aqhw.onrender.com/api/projects/recent",
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok)
          throw new Error("Failed to fetch recent projects");
        return res.json();
      })
      .then(setProjects)
      .catch((err) =>
        console.error("❌ Failed to load recent projects:", err)
      )
      .finally(() => setLoading(false));
  }, [session]);

  /* ===============================
     OPTIMISTIC UPDATES
     =============================== */
  const handleDelete = (id: string) => {
    setProjects((prev) =>
      prev.filter((p) => p._id !== id)
    );
  };

  const handleRename = (id: string, name: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, projectName: name } : p
      )
    );
  };

  if (loading) return <SplashScreen />;

  return (
    <div className="w-full flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-wide">
            Recent
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Your most recently updated projects
          </p>
        </div>

        <Button onClick={() => setShowModals(true)}>
          <PlusCircle size={16} /> New Project
        </Button>
      </div>

      {/* CONTENT */}
      <div className="flex items-center flex-wrap gap-8 p-6">
        {projects.length > 0 ? (
          <RecentCard
            project={projects}
            onDelete={handleDelete}
            onRename={handleRename}
          />
        ) : (
          <p className="w-full text-gray-400 text-xl text-center mt-10">
            No recent projects found.
          </p>
        )}
      </div>
    </div>
  );
}
