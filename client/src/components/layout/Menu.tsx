import {
  Clock,
  Folder,
  Users,
  FileStack,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../ui/Button.tsx";
import Avatar from "../ui/Avatar.tsx";
import type { MenuProps } from "../../types/Types.ts";
import {useAuth} from "../../features/auth/context/useAuth.tsx"

const navItem =
  "w-full px-6.5 py-2 rounded flex items-center gap-2 transition hover:bg-neutral-800";

const navItemActive =
  "text-blue-500 bg-neutral-800";

export default function Menu({ setShowModals }: MenuProps) {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const {logout,userDetail}=useAuth();


  const navigate = useNavigate();

  const userName = userDetail?.name ;

  const userEmail =userDetail?.email ;


  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(undefined), 4000);
    return () => clearTimeout(timer);
  }, [error]);


  async function handleSignOut() {
    try {
      setLoading(true);
      logout();
      navigate("/");
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <nav className="w-52 h-screen fixed left-0 top-12 bg-[#0c0f1a] border-r border-white/10 flex flex-col justify-between">
      {/* ================= NAV LINKS ================= */}
      <ul className="py-6 space-y-2 text-gray-300">
        <li>
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `${navItem} ${isActive ? navItemActive : ""}`
            }
          >
            <Clock size={16} /> Recent
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/dashboard/allrepository"
            className={({ isActive }) =>
              `${navItem} ${isActive ? navItemActive : ""}`
            }
          >
            <Folder size={16} /> All Repository
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/dashboard/invititions"
            className={({ isActive }) =>
              `${navItem} ${isActive ? navItemActive : ""}`
            }
          >
            <Bell size={16} /> Invitations
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/dashboard/sharewithme"
            className={({ isActive }) =>
              `${navItem} ${isActive ? navItemActive : ""}`
            }
          >
            <Users size={16} /> Shared with me
          </NavLink>
        </li>

        <li
          onClick={() => setShowModals(true)}
          className={`${navItem} cursor-pointer`}
        >
          <FileStack size={16} /> Templates
        </li>

        <li>
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              `${navItem} ${isActive ? navItemActive : ""}`
            }
          >
            <Settings size={16} /> Settings
          </NavLink>
        </li>
      </ul>

      {/* ================= PROFILE + SIGN OUT ================= */}
      <div className="px-4 pb-6 space-y-4">
        <div className="border-t border-white/10" />

        {/* PROFILE */}
        <div
          onClick={() => navigate("/dashboard/settings")}
          className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-neutral-800 transition"
        >
          <Avatar name={userName || "User"} url={userDetail?.avatarUrl || "LOCAL"} />

          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-white truncate">
              {userName}
            </span>
            <span className="text-xs text-zinc-400 truncate">
              {userEmail}
            </span>
          </div>
        </div>

        {/* SIGN OUT */}
        <Button
          className="w-full h-8 mb-12"
          isTransparent
          disabled={loading}
          onClick={handleSignOut}
        >
          {loading ? (
            <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <>
              <LogOut size={16} /> Sign out
            </>
          )}
        </Button>

        {error && (
          <p className="text-center text-xs text-red-500">
            {error}
          </p>
        )}
      </div>
    </nav>
  );
}
