import { useEffect, useState } from "react";
import SettingItem from "./SettingItem.tsx";
import StatCard from "./StatCard.tsx";
import SplashScreen from "../../../components/loader/PageScreenLoader.tsx";
import ResetPassword from "../../auth/components/ResetPasswordModals.tsx";
import Modal from "./SettingModals.tsx";
import DeleteAccountModal from "../../auth/components/DeleteAccountModal.tsx";
import { useAuth } from "../../auth/context/useAuth.tsx";

export default function Settings() {
  const { session } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showResetPassword, setShowResetPassword] =
    useState(false);
  const [showDeleteAccount, setShowDeleteAccount] =
    useState(false);

  const [stats, setStats] = useState({
    totalWorkedOn: 0,
    createdByYou: 0,
    collaboratedProjects: 0,
  });

  /* ===============================
     FETCH PROJECT STATS
     =============================== */
  useEffect(() => {
    if (!session?.access_token) return;

    setLoading(true);
    setError(null);

    fetch(
      "https://codevspace-aqhw.onrender.com/api/users/project-stats",
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load stats");
        }
        return res.json();
      })
      .then((data) => {
        setStats({
          totalWorkedOn: data.totalWorkedOn,
          createdByYou: data.createdByYou,
          collaboratedProjects: data.collaboratedProjects,
        });
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load account statistics");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [session]);

  /* ===============================
     LOADING STATE
     =============================== */
  if (loading) return <SplashScreen />;

  return (
    <section className="w-full p-6 max-w-7xl">
      {/* HEADER */}
      <h1 className="text-2xl font-semibold tracking-wide">
        Settings
      </h1>
      <p className="text-sm text-zinc-400 mt-1">
        Manage your account preferences and security
      </p>

      {/* STATS */}
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

          <SettingItem
            title="Delete account"
            description="This action is permanent and cannot be undone"
            actionLabel="Delete"
            danger
            settingFunction={() =>
              setShowDeleteAccount(true)
            }
          />
        </div>
      </div>

      {/* RESET PASSWORD MODAL */}
      {showResetPassword && (
        <Modal onClose={() => setShowResetPassword(false)}>
          <ResetPassword
            onClose={() => setShowResetPassword(false)}
          />
        </Modal>
      )}

      {/* DELETE ACCOUNT MODAL */}
      {showDeleteAccount && (
        <Modal onClose={() => setShowDeleteAccount(false)}>
          <DeleteAccountModal
            onClose={() => setShowDeleteAccount(false)}
          />
        </Modal>
      )}
    </section>
  );
}
