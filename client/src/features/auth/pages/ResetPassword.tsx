import Button from "../../../components/ui/Button.tsx";
import Input from "../../../components/ui/Input.tsx";
import NavBar from "../../../components/layout/NavBar.tsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// @ts-ignore
import authService from "../../../services/authService.js"


export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const navigate=useNavigate()
  const urlParams=new URLSearchParams(location.search);
  const token=urlParams.get("token");


  async function handleSubmit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData=new FormData(e.currentTarget)
    const password=formData.get("password") as string

    if (!password) {
    setError("Password is required.");
    setLoading(false);
    return;
  }

    try{
      await authService.resetPassword(token,password)
      navigate("/login");
    }catch (err:any){
      setError(err?.message || "Something Went wrong.")
      console.error(err)
    }finally{
      setLoading(false)
    }


  }
  return (
    <section className="w-full h-screen pt-12 flex flex-col">
      <NavBar authRequired={false} />
      <main className="flex-1 flex flex-col items-center text-white bg-gradient-to-b from-black via-gray-900 to-[#0c0f1a]">
        <div className="bg-black/40 border border-white/10 text-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-auto mt-20">
          <h2 className="text-2xl font-bold mb-3 text-center">
            Set a New Password
          </h2>
          <p className="text-sm text-gray-300 text-center mb-5">
            Enter and confirm your new password to secure your account.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm text-gray-300 mb-1"
              >
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
              />
            </div>
            

            <Button type="submit" disabled={loading} className="mt-4 h-8">
              {loading ? (<div className='w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin'/>): "Submit"}
            </Button>
          </form>

          {error && <p className="text-red-500 pt-4 text-center">{error}</p>}
        </div>
      </main>
    </section>
  );
}
