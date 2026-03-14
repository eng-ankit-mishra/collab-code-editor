import Button from "../../../components/ui/Button.tsx";
import { useState } from "react";
import { useAuth } from "../context/useAuth.tsx";

export default function DeleteAccountModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const { deleteAccount, signOutUser, session } = useAuth();
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConfirmed = confirm === "DELETE";

  async function handleDelete() {
    if (!isConfirmed || !session?.access_token) return;

    setLoading(true);
    setError(null);

    try {
      const result = await deleteAccount(session.access_token);

      if (!result.success) {
        throw new Error(result.error);
      }

      await signOutUser();
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message || "Failed to delete account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-white">
      <h2 className="text-xl font-semibold text-red-500 text-center mb-2">
        Delete Account
      </h2>

      <p className="text-sm text-zinc-400 text-center mb-4">
        This action is irreversible. All your data will be permanently removed.
      </p>

      <p className="text-sm text-zinc-300 mb-2">
        Type <span className="text-red-500 font-semibold">DELETE</span> to confirm
      </p>

      <input
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="w-full bg-neutral-800 border border-white/10 px-3 py-2 rounded-md"
        placeholder="DELETE"
      />

      {error && (
        <p className="text-red-500 text-sm mt-3 text-center">
          {error}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <Button isTransparent onClick={onClose}>
          Cancel
        </Button>

        <Button
          disabled={!isConfirmed || loading}
          className="bg-red-600 hover:bg-red-700"
          onClick={handleDelete}
        >
          {loading ? "Deleting..." : "Delete Account"}
        </Button>
      </div>
    </div>
  );
}
