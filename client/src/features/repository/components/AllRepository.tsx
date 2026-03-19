import RecentCard from "./RecentCard.tsx";
//import SplashScreen from "../../../components/loader/PageScreenLoader.tsx";
//import { useAuth } from "../../auth/context/useAuth.tsx";
import type {DashboardOutlet} from "../../../types/Types.ts";
import {useOutletContext} from "react-router-dom"

export default function AllRepository() {

  const {projects}=useOutletContext<DashboardOutlet>();

  return (
    <div className="w-full flex flex-col p-6">
      <h1 className="text-2xl font-semibold tracking-wide">
        All Repository
      </h1>
      <p className="text-sm text-neutral-400 mt-1 pb-10">
        All projects you have created or collaborated on
      </p>

      {/* CONTENT */}
      <div className="flex items-center flex-wrap gap-8">
        {projects.length > 0 ? (
          <RecentCard
            projects={projects}
          />
        ) : (
          <p className="w-full text-gray-400 text-xl text-center mt-10">
            No projects found.
          </p>
        )}
      </div>
    </div>
  );
}
