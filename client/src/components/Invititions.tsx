import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import Button from "./Button";
import SplashScreen from "./PageScreenLoader";
import type { Language } from "./Types";
import { Code, User ,Eye ,Pencil} from "lucide-react";

type Invitation = {
  _id: string;
  role: "VIEWER" | "EDITOR";
  userName: string;
  projectId: {
    _id: string;
    projectName: string;
    template:Language
  };
};

export default function Invitations() {
  const { session } = useAuth();
  const [invites, setInvites] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ---------- FETCH INVITES ---------- */
  useEffect(() => {
    async function fetchInvites() {
      try {
        const res = await fetch(
          "https://codevspace-aqhw.onrender.com/api/projects/invites",
          {
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch invites");
        }

        setInvites(data);
        console.log(data)
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (session) fetchInvites();
  }, [session]);

  /* ---------- ACTIONS ---------- */
  async function handleAction(
  inviteId: string,
  action: "accept" | "reject"
) {
  if (!session?.access_token) return;

  try {
    const method = action === "accept" ? "POST" : "DELETE";

    const res = await fetch(
      `https://codevspace-aqhw.onrender.com/api/projects/invites/${inviteId}/${action}`,
      {
        method,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Invite action failed");
    }

    // ✅ Optimistic UI update
    setInvites((prev) => prev.filter((i) => i._id !== inviteId));
  } catch (err) {
    console.error("❌ Invite action failed:", err);
  }
}


  /* ---------- UI STATES ---------- */
  if (loading) return <SplashScreen />;

  if (error) {
    return <p className="text-red-500 text-center mt-6">{error}</p>;
  }

  if (invites.length === 0) {
    return (
      <div className="w-full text-gray-400 text-xl text-center mt-10 flex justify-center ">
        No pending invitations.
      </div>
    );
  }

  /* ---------- UI ---------- */
  return (
    <section className="p-6">

    
    <h1 className="text-2xl font-semibold tracking-wide pt-2">Invititions</h1>
    <p className="text-sm text-neutral-400 mt-1 pb-10">
  Projects others have shared with you
</p>
    <div className="grid grid-cols-2 gap-8">
      {invites.map((invite) => (
        <div
          key={invite._id}
          className="p-4 w-68 h-46 bg-gray-700/30 border cursor-pointer border-white/10 shadow-md hover:shadow-xl transition-all duration-300 rounded-md flex flex-col text-sm text-zinc-400"
        >
          <h3 className="text-lg font-semibold text-white">
            {invite.projectId.projectName}
          </h3>
          <div className="pt-2">
            <p className="mt-1 flex gap-2 items-center">
            <Code size={14}/>
            <span>Language:{" "}
            {invite.projectId.template.name}
            </span>
          </p>
          <p className=" mt-1 ">
            {invite.role === "EDITOR" ? <span className="flex gap-2 items-center"><Pencil size={14}/>Permission: Can edit</span> : <span className="flex gap-2 items-center"><Eye size={14}/>Permission: Can view</span>}
          </p>
            <p className=" mt-1 flex gap-2 items-center">
            <User size={14}/>
            <span>Invited By: {invite.userName?.split(" ")[0]}
            </span>
            
          </p>
          </div>
          

          <div className="flex justify-between mt-4">
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleAction(invite._id, "accept")}
            >
              Accept
            </Button>

            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={() => handleAction(invite._id, "reject")}
            >
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
    </section>
  );
}
