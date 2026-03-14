import { useEffect, useState,useRef } from "react";
import { useAuth } from "../../auth/context/useAuth.tsx";
import { useNavigate } from "react-router-dom";
import SplashScreen from "../../../components/loader/PageScreenLoader.tsx";
import { Code, User, Clock, Ellipsis,Eye,Pencil} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Language } from "../../../types/Types.ts";


/* ---------- TYPES ---------- */
type SharedProject = {
  _id: string;               // projectId
  projectName: string;
  ownerName:string;
  role: "VIEWER" | "EDITOR";
  updatedAt: string;
  template: Language
};

export default function SharedWithMe() {
  const { session } = useAuth();
  const accessToken=session?.access_token
  const navigate = useNavigate();

  const [projects, setProjects] = useState<SharedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOptionId, setShowOptionId] = useState<string>();

  const cardDropDownRef = useRef<HTMLDivElement>(null);
  
    /* ---------- CLOSE DROPDOWN ---------- */
    useEffect(() => {
      function handleOutside(e: MouseEvent) {
        if (cardDropDownRef.current && !cardDropDownRef.current.contains(e.target as Node)) {
          setShowOptionId(undefined);
        }
      }
  
      function handleEsc(e: KeyboardEvent) {
        if (e.key === "Escape") {
          setShowOptionId(undefined);
        }
      }
  
      document.addEventListener("mousedown", handleOutside);
      document.addEventListener("keydown", handleEsc);
  
      return () => {
        document.removeEventListener("mousedown", handleOutside);
        document.removeEventListener("keydown", handleEsc);
      };
    }, []);

  /* ---------- FETCH SHARED PROJECTS ---------- */
  useEffect(() => {
    // If auth is still resolving
    if (session === undefined) return;

    // If not logged in
    if (!session) {
      setLoading(false);
      return;
    }

    async function fetchSharedProjects() {
      try {
        const res = await fetch(
          "https://codevspace-aqhw.onrender.com/api/projects/shared-with-me",
          {
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
            },
          }
        );

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to load projects");
        }

        const data: SharedProject[] = await res.json();
        console.log(data);
        setProjects(data);
      } catch (err: any) {
        console.error("❌ Failed to fetch shared projects:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchSharedProjects();
  }, [session]);

  async function handleDelete(projectId?: string) {
  if (!projectId || !accessToken || !session?.user?.id) return;

  try {
    const res = await fetch(
      `https://codevspace-aqhw.onrender.com/api/projects/${projectId}/collaborators/${session.user.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to leave project");
    }

    // ✅ Optimistic UI update
    setProjects(prev => prev.filter(p => p._id !== projectId));
    setShowOptionId(undefined);

    console.log("✅ Left project successfully");
  } catch (err) {
    console.error("❌ Leave project failed:", err);
  }
}


  /* ---------- UI STATES ---------- */

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
          key={project._id}
          className="p-4 w-68 h-44 bg-gray-700/30 border cursor-pointer border-white/10 shadow-md hover:scale-[1.02] hover:shadow-xl transition-all duration-300 rounded-md flex flex-col text-sm text-zinc-400"
          onClick={() =>
              navigate(`/editor/${project._id}`, {
                state: { accessRole: project.role },
              })
            }
        >
          {/* Project name */}
          <div className="relative flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            {project.projectName}
          </h3>
          <button
              className="text-gray-400 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                setShowOptionId((prev) => (prev === project._id ? undefined : project._id));
              }}
            >
              <Ellipsis size={16} />
            </button>
            {showOptionId === project._id && (
              <div
                ref={cardDropDownRef}
                className="absolute left-45 top-full mt-1 bg-neutral-900 rounded shadow"
              >
                <ul className="p-2">
                  <li
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(project._id);
                    }}
                    className="text-gray-300  hover:bg-gray-800 text-sm px-3 py-1 rounded cursor-pointer"
                  >
                    Delete
                  </li>
                </ul>
              </div>
            )}
            </div>

          <div className="space-y-1 pt-2 mb-4 mt-1">
            <p className="flex gap-2 items-center">
              <Code size={14}/> 
              <span>Language: {project.template.name}</span>  
            </p>
          {/* Role */}
            <p className="mt-1">
              {project.role === "EDITOR" ? <span className="flex gap-2 items-center"><Pencil size={14}/>Permission: Can edit</span> : <span className="flex gap-2 items-center" ><Eye size={14}/>Permission: Can view</span>}     
            </p>
            <p className="flex gap-2  items-center mt-1">
              <User size={14}/>
              <span>Created by {project.ownerName?.split(" ")[0]}</span>     
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
