import NavBar from "../../../components/layout/NavBar.tsx";
import { FcGoogle } from "react-icons/fc";
import { SiGithub } from "react-icons/si";
import Button from "../../../components/ui/Button.tsx";
import Input from "../../../components/ui/Input.tsx";
import { Link, useNavigate} from "react-router-dom";
import { useState, type FormEvent, useEffect } from "react";
import { useAuth } from "../context/useAuth.tsx";
// @ts-ignore
import authService from "../../../services/authService.js"

export default function LogIn() {
  const { login} = useAuth();
  const navigate = useNavigate();


  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const data = await authService.authenticate(email, password);
      const token=data.token

      login(token);

      navigate("/dashboard", {
        replace: true,
        state: { showToast: "SignIn" },
      });
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    try {
      setLoading(true);
      window.location.href = "https://codevspace.codes/oauth2/authorization/google";
    } catch (err) {
      console.error(err);
      setError("Google login failed.");
      setLoading(false);
    }
  };

  const handleGithubClick = async () => {
    try {
      setLoading(true);
      window.location.href = "https://codevspace.codes/oauth2/authorization/github";
    } catch (err) {
      console.error(err);
      setError("GitHub login failed.");
      setLoading(false);
    }
  };

  return (
    <section className="w-full h-screen pt-12 flex flex-col">
      <NavBar authRequired={false} />

      <main className="flex-1 flex flex-col items-center text-white bg-gradient-to-b from-black via-gray-900 to-[#0c0f1a]">
        <div className="bg-black/40 border border-white/10 rounded-xl shadow-2xl p-8 w-full max-w-md mx-auto mt-20">
          <h2 className="text-2xl font-bold mb-3 text-center">
            Log in to CoDevSpace
          </h2>

          <p className="text-sm text-gray-300 text-center mb-5">
            Access your projects, join your team, and start coding together.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Email</label>
              <Input name="email" type="email" placeholder="you@example.com" />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Password
              </label>
              <Input name="password" type="password" placeholder="••••••••" />
            </div>

            <Button type="submit" disabled={loading} className="mt-4 h-8">
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                "Log in"
              )}
            </Button>
          </form>

          {error && (
            <p className="text-red-500 pt-4 text-center">{error}</p>
          )}

          <Link
            to="/forgot-password"
            className="text-blue-500 text-sm underline block text-center mt-4"
          >
            Forgot Password?
          </Link>

          <div className="flex gap-2 justify-between mt-4">
            <button
              onClick={handleGoogleClick}
              className="rounded-md bg-gray-800 py-2 px-3 text-xs flex items-center gap-2 hover:bg-gray-900"
            >
              <FcGoogle size={18} /> Continue with Google
            </button>

            <button
              onClick={handleGithubClick}
              className="rounded-md bg-gray-800 py-2 px-3 text-xs flex items-center gap-2 hover:bg-gray-900"
            >
              <SiGithub size={18} /> Continue with GitHub
            </button>
          </div>

          <p className="text-sm text-center mt-4 text-gray-300">
            New to CoDevSpace?{" "}
            <Link to="/signup" className="text-blue-500 underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </section>
  );
}
