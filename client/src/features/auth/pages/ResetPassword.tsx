import Button from "../../../components/ui/Button.tsx";
import Input from "../../../components/ui/Input.tsx";
import NavBar from "../../../components/layout/NavBar.tsx";
import { useState } from "react";
import { useAuth } from "../context/useAuth.tsx";

export default function ResetPassword() {
  const { resetPassword } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string)?.trim();

    if (!email) {
      setError("Please enter your email address.");
      setLoading(false);
      return;
    }

    try {
      const result = await resetPassword(email);

      if (!result.success) {
        throw new Error(result.error || "Failed to send reset email.");
      }

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full h-screen pt-12 flex flex-col">
      <NavBar authRequired={false} />

      <main className="flex-1 flex flex-col items-center text-white bg-gradient-to-b from-black via-gray-900 to-[#0c0f1a]">
        <div className="bg-black/40 border border-white/10 rounded-xl shadow-2xl p-8 w-full max-w-md mx-auto mt-20">
          <h2 className="text-2xl font-bold mb-3 text-center">
            Reset Your Password
          </h2>

          <p className="text-sm text-gray-300 text-center mb-5">
            Enter your email address and we’ll send you a link to reset your
            password.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Email
              </label>
              <Input
                name="email"
                type="email"
                placeholder="you@example.com"
              />
            </div>

            <Button type="submit" disabled={loading} className="mt-4 h-8">
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>

          {success && (
            <p className="text-green-500 font-medium pt-4 text-center">
              Password reset link sent successfully. Please check your email.
            </p>
          )}

          {error && (
            <p className="text-red-500 pt-4 font-medium text-center">
              {error}
            </p>
          )}
        </div>
      </main>
    </section>
  );
}
