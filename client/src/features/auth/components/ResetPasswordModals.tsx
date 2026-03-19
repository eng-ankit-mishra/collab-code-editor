import Button from "../../../components/ui/Button.tsx";
import Input from "../../../components/ui/Input.tsx";
import { useState } from "react";
// @ts-ignore
import authService from "../../../services/authService";

export default function ForgotPassword({
  onClose,
}: {
  onClose?: () => void;
}) {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return; // 🔒 prevent double submit

    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string)?.trim();

    // ✅ basic validation
    if (!email) {
      setError("Please enter your email address.");
      setLoading(false);
      return;
    }

    try {
       await authService.forgotPassword(email);

      setSuccess(true);
      if (onClose) {
        setTimeout(() => onClose(), 2000);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-white">
      {/* HEADER */}
      <h2 className="text-xl font-semibold text-center mb-2">
        Reset Password
      </h2>

      <p className="text-sm text-zinc-400 text-center mb-5">
        Enter your email address and we’ll send you a reset link.
      </p>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm text-zinc-300 mb-1">
            Email
          </label>
          <Input
            name="email"
            type="email"
            placeholder="you@example.com"
            
          />
        </div>

        <Button
          disabled={loading || success}
          className="h-9"
          type="submit"
        >
          {loading ? (
            <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : success ? (
            "Email Sent"
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </form>

      {/* FEEDBACK */}
      {success && (
        <p className="text-green-500 text-sm font-medium pt-4 text-center">
          Reset link sent. Please check your email.
        </p>
      )}

      {error && (
        <p className="text-red-500 text-sm font-medium pt-4 text-center">
          {error}
        </p>
      )}

      {/* ACTIONS */}
      {onClose && !loading && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="text-sm text-zinc-400 hover:text-white"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
