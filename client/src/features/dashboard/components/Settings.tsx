import {useEffect, useState} from "react";
import SettingItem from "./SettingItem.tsx";
import StatCard from "./StatCard.tsx";
import SplashScreen from "../../../components/loader/PageScreenLoader.tsx";
import ResetPassword from "../../auth/components/ResetPasswordModals.tsx";
import Modal from "./SettingModals.tsx";
// @ts-ignore
import projectService from "../../../services/projectService";

export default function Settings() {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showResetPassword, setShowResetPassword] =
    useState(false);

  const [stats, setStats] = useState({
    totalWorkedOn: 0,
    createdByYou: 0,
    collaboratedProjects: 0,
  });

    useEffect(() => {
        setLoading(true);
        const fetchUserStats=async ()=>{
            try{
                const data=await projectService.getUserStats();
                console.log(data);
                setStats({
                    totalWorkedOn: data.totalProjects,
                    createdByYou: data.createdByUser,
                    collaboratedProjects: data.sharedWithYou,
                })
            }catch(err){
                setError("Something went wrong");
                console.log(err);
            }finally {
                setLoading(false);
            }
        }

        void fetchUserStats();
    }, [stats]);




  if (loading) return <SplashScreen />;

  return (
    <section className="w-full p-6 max-w-7xl">
      <h1 className="text-2xl font-semibold tracking-wide">
        Settings
      </h1>
      <p className="text-sm text-zinc-400 mt-1">
        Manage your account preferences and security
      </p>

      <div className="mt-6">
        <h2 className="text-lg font-medium mb-3">
          Account Overview
        </h2>

        {error ? (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              value={stats.totalWorkedOn}
              label="Total projects worked on"
            />
            <StatCard
              value={stats.createdByYou}
              label="Created by you"
            />
            <StatCard
              value={stats.collaboratedProjects}
              label="Collaborated projects"
            />
          </div>
        )}
      </div>

      {/* SETTINGS */}
      <div className="mt-10">
        <h2 className="text-lg font-medium mb-3">
          Account Settings
        </h2>

        <div className="space-y-4">
          <SettingItem
            title="Reset password"
            description="Secure your account with a new password"
            actionLabel="Reset"
            settingFunction={() =>
              setShowResetPassword(true)
            }
          />

        </div>
      </div>

      {showResetPassword && (
        <Modal onClose={() => setShowResetPassword(false)}>
          <ResetPassword
            onClose={() => setShowResetPassword(false)}
          />
        </Modal>
      )}

    </section>
  );
}
