import { useEffect, useState } from "react";
import { useAuth } from "../../auth/context/useAuth.tsx";
import Button from "../../../components/ui/Button.tsx";
import SplashScreen from "../../../components/loader/PageScreenLoader.tsx";
import type { Invitation } from "../../../types/Types.ts";
import { Code, User } from "lucide-react";
// @ts-ignore
import projectService from "../../../services/projectService.js"



export default function Invitations() {
  const { session } = useAuth();
  const [invites, setInvites] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInvites() {
      try {
        const data = await projectService.getAllInvitations();
        setInvites(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    void fetchInvites();
  }, [session]);

  async function handleAction(
  projectId: string,
  action: "accept" | "reject"
) {
  if (!session) return;

  try {
    await projectService.respondToInvitation(projectId, action==="accept");
    setInvites((prev) => prev.filter((i) => i.projectId !== projectId));
  } catch (err) {
    console.error("❌ Invite action failed:", err);
  }
}

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

  return (
    <section className="p-6">

    
    <h1 className="text-2xl font-semibold tracking-wide pt-2">Invitations</h1>
    <p className="text-sm text-neutral-400 mt-1 pb-10">
  Projects others have shared with you
</p>
    <div className="grid grid-cols-2 gap-8">
      {invites.map((invite) => (
        <div
          key={invite.projectId}
          className="p-4 w-68 h-46 bg-gray-700/30 border cursor-pointer border-white/10 shadow-md hover:shadow-xl transition-all duration-300 rounded-md flex flex-col text-sm text-zinc-400"
        >
          <h3 className="text-lg font-semibold text-white">
            {invite.projectName}
          </h3>
          <div className="pt-2">
            <p className="mt-1 flex gap-2 items-center">
            <Code size={14}/>
            <span>Language:{" "}
            {invite.language.name}
            </span>
          </p>
          <p className=" mt-1 ">
            <span className="flex gap-2 items-center">Permission: {invite.permission}</span>
          </p>
            <p className=" mt-1 flex gap-2 items-center">
            <User size={14}/>
            <span>Invited By: {invite.invitedBy}
            </span>
            
          </p>
          </div>
          

          <div className="flex justify-between mt-4">
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleAction(invite.projectId, "accept")}
            >
              Accept
            </Button>

            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={() => handleAction(invite.projectId, "reject")}
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
