import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import Button from "../../../components/ui/Button.tsx";
import { useAuth } from "../../auth/context/useAuth.tsx";

interface ShareModalProps {
  roomId: string;
  onClose: () => void;
}

export default function ShareModal({ roomId, onClose }: ShareModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState<"view" | "edit">("view");
  const { session } = useAuth();


  /* ---------- ESC CLOSE ---------- */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

 

 const handleInvite = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email) return;

  // 🔁 UI → Backend mapping
  const role = permission === "edit" ? "EDITOR" : "VIEWER";

  try {
    setLoading(true);
    setError(null);

    const res = await fetch(
      `https://codevspace-aqhw.onrender.com/api/projects/${roomId}/invite`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          email,
          role, // ✅ CORRECT FIELD
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Invite failed");
    }

    console.log(data);
    // ✅ UX success
    setEmail("");
    setPermission("view");
  

  } catch (err: any) {
    setError(err.message || "Failed to send invite");
  } finally {
    setLoading(false);
  }
};



  /* ---------- INVITE SUBMIT (UI ONLY FOR NOW) ---------- */

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-neutral-900 border border-white/10 text-gray-100 p-6 rounded-xl shadow-lg w-full max-w-md relative">
        
        {/* Close */}
        <button
          className="absolute top-3 right-3 text-white text-lg"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-1">Share Project</h2>
        <p className="text-sm text-gray-400 mb-5">
          Invite people or share a link to collaborate.
        </p>

        {/* ---------- INVITE FORM ---------- */}
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label className="text-sm text-gray-300">Invite by email</label>
            <input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 rounded-md bg-neutral-800 border border-white/10 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-1 block">
              Permission
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={permission === "view"}
                  onChange={() => setPermission("view")}
                />
                Can view
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={permission === "edit"}
                  onChange={() => setPermission("edit")}
                />
                Can edit
              </label>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Sending..." : "Send Invite"}
          </Button>
          {error && (
  <p className="text-red-500 text-sm mt-2 text-center">
    {error}
  </p>
)}


        </form>

        
      </div>
    </div>,
    document.body
  );
}
