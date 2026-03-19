import Button from "../../../components/ui/Button.tsx";
import RecentCard from "./RecentCard.tsx";
import { PlusCircle } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutlet } from "../../../types/Types.ts";

export default function Recent() {
  const { setShowModals,projects} =
    useOutletContext<DashboardOutlet>();

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

      <div className="flex items-center flex-wrap gap-8 p-6">
        {projects.length > 0 ? (
          <RecentCard
            projects={projects}
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
