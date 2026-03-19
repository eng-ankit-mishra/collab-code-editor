import NavBar from "../../../components/layout/NavBar.tsx";
import CodeEditorPanel from "../components/CodeEditorPanel.tsx";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { ProjectDetails } from "../../../types/Types.ts";
import SplashScreen from "../../../components/loader/FullScreenLoader.tsx";
// @ts-ignore
import projectService from "../../../services/projectService";

export default function CodePlayground() {
  const { projectId } = useParams<{ projectId: string }>();

  const [project, setProject] = useState<ProjectDetails | null>(null);


  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;

      try {
        const data = await projectService.getProjectById(projectId)
        setProject(data);
      } catch (err) {
        console.error("❌ Failed to load project:", err);
      }
    };

    void fetchProject();
  }, []);

  return (
    <section className="w-full h-screen flex flex-col bg-gradient-to-br from-neutral-950 via-neutral-800 to-neutral-950 text-white">
      <NavBar
        authRequired
        shareRequired
        projectName={
          project
            ? `${project.name} / ${project.language.name || "No Label"}`
            : ""
        }
      />

      <main className="w-full h-full pt-12 flex-1 flex">
        <div className="flex-1">
          {project ? (
            <CodeEditorPanel
              projectObject={project}
            />
          ) : (
            <SplashScreen />
          )}
        </div>
      </main>
    </section>
  );
}
