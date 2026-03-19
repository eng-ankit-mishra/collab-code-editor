import { useEffect, useState} from "react";
import { useAuth } from "../../auth/context/useAuth.tsx";
import { useNavigate } from "react-router-dom";
import SplashScreen from "../../../components/loader/PageScreenLoader.tsx";
import { Code, User, Clock,Eye,Pencil} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type {DashboardProjects} from "../../../types/Types.ts";
// @ts-ignore
import projectService from "../../../services/projectService";




export default function SharedWithMe() {
  const { session } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<DashboardProjects[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ---------- FETCH SHARED PROJECTS ---------- */
  useEffect(() => {
    if (session === undefined) return;
    if (!session) {
      setLoading(false);
      return;
    }

    async function fetchSharedProjects() {
      try {
        const data = await projectService.sharedProject();
        setProjects(data);
      } catch (err: any) {
        console.error("❌ Failed to fetch shared projects:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    void fetchSharedProjects();
  }, [session]);


  if (loading) return <SplashScreen />;

  if (!session) {
    return (
      <p className="text-gray-400 text-center mt-10">
        Please log in to see shared projects.
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-red-500 text-center mt-10">
        {error}
      </p>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="w-full text-gray-400 text-xl text-center mt-10 flex justify-center ">
        No shared project.
      </div>
    );
  }

  /* ---------- MAIN UI ---------- */
  return (
    <section className="p-6">

    
    <h1 className="text-2xl font-semibold tracking-wide pt-2">Shared with me</h1>
    <p className="text-sm text-neutral-400 mt-1 pb-10">
  Projects shared with you by collaborators
</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ">
      
      {projects.map((project) => (
        <div
          key={project.id}
          className="p-4 w-68 h-44 bg-gray-700/30 border cursor-pointer border-white/10 shadow-md hover:scale-[1.02] hover:shadow-xl transition-all duration-300 rounded-md flex flex-col text-sm text-zinc-400"
          onClick={() =>
              navigate(`/editor/${project.id}`)
            }
        >
          {/* Project name */}
          <div className="relative flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            {project.name}
          </h3>

            </div>

          <div className="space-y-1 pt-2 mb-4 mt-1">
            <p className="flex gap-2 items-center">
              <Code size={14}/> 
              <span>Language: {project.language.name}</span>
            </p>
          {/* Role */}
            <p className="mt-1">
              {project.permission === "EDITOR" ? <span className="flex gap-2 items-center"><Pencil size={14}/>Permission: Can edit</span> : <span className="flex gap-2 items-center" ><Eye size={14}/>Permission: Can view</span>}
            </p>
            <p className="flex gap-2  items-center mt-1">
              <User size={14}/>
              <span>Created by {project.ownershipStatus}</span>
            </p>
          </div>
          

          <p className="flex gap-2  items-center">
              <Clock size={14}/> 
              {formatDistanceToNow(new Date(project.updatedAt ?? 0), {
              addSuffix: true,
            })} 
          </p>

        </div>
      ))}
    </div>
    </section>
  );
}
