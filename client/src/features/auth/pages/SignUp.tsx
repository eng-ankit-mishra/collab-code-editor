import NavBar from "../../../components/layout/NavBar.tsx";
import { FcGoogle } from "react-icons/fc";
import { SiGithub } from "react-icons/si";
import Button from "../../../components/ui/Button.tsx";
import Input from "../../../components/ui/Input.tsx";
import { Link} from "react-router-dom";
import { useAuth } from "../context/useAuth.tsx";
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
// @ts-ignore
import authService from "../../../services/authService";

export default function SignUp() {
  const {login} = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  async function handleSignUp(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  if (loading) return;
  setLoading(true);

  setError(null);
  setSuccess(null);

  const formData = new FormData(e.currentTarget);
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const data = await authService.register(name, email, password);
    login(data.token)
    setSuccess(
      "Verification email sent successfully. Please check your inbox."
    );

  } catch (err) {
    console.error(err);
    setError("Signup failed");
  } finally {
    setLoading(false);
  }
}



  const handleGoogleClick = async () => {
    try {
      setLoading(true);
      window.location.href = "http://13.127.234.216:8080/oauth2/authorization/google";
    } catch (err) {
      console.error(err);
      setError("Google signup failed.");
      setLoading(false);
    }
  };

  const handleGithubClick = async () => {
    try {
      setLoading(true);
      window.location.href = "http://13.127.234.216:8080/oauth2/authorization/github";
    } catch (err) {
      console.error(err);
      setError("GitHub signup failed.");
      setLoading(false);
    }
  };

  return (
    <section className="w-full h-screen pt-12 flex flex-col">
      <NavBar authRequired={false} />

      <main className="flex-1 flex flex-col text-gray-300 text-sm bg-gradient-to-b from-black via-gray-900 to-[#0c0f1a]">
        <div className="flex flex-col p-8 max-w-md bg-black/40 shadow-2xl border border-white/10 rounded-lg mx-auto my-auto">
          <h1 className="text-2xl text-center text-white font-bold mb-3">
            Create your CoDevSpace account
          </h1>

          <p className="text-center mb-5">
            Start coding together — join projects, connect with your team, and
            build collaboratively.
          </p>

          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            <div>
              <label className="block pb-1">Full Name</label>
              <Input name="name" type="text" placeholder="John Smith" />
            </div>

            <div>
              <label className="block pb-1">Email</label>
              <Input name="email" type="email" placeholder="you@email.com" />
            </div>

            <div>
              <label className="block pb-1">Password</label>
              <Input
                name="password"
                type="password"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" disabled={loading} className="mt-4 h-8">
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                "Sign up"
              )}
            </Button>

            {error && (
               <p className="text-red-500 pt-2 text-center">{error}</p>
            )}

            {success && (
              <p className="text-green-500 pt-2 text-center">{success}</p>
              )}

          </form>

          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-500 underline hover:text-blue-600"
            >
              Log in
            </Link>
          </p>

          <div className="flex gap-2 justify-between mt-4">
            <button
              type="button"
              onClick={handleGoogleClick}
              className="rounded-md bg-gray-800 py-2 px-3 text-xs flex items-center gap-2 hover:bg-gray-900"
            >
              <FcGoogle size={18} />
              Continue with Google
            </button>

            <button
              type="button"
              onClick={handleGithubClick}
              className="rounded-md bg-gray-800 py-2 px-3 text-xs flex items-center gap-2 hover:bg-gray-900"
            >
              <SiGithub size={18} />
              Continue with GitHub
            </button>
          </div>
        </div>
      </main>
    </section>
  );
}
