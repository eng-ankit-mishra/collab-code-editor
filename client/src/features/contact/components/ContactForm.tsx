import {useEffect, useState} from "react";
import Button from "../../../components/ui/Button.tsx";
import Input from "../../../components/ui/Input.tsx";
import { FiSend } from "react-icons/fi";
// @ts-ignore
import contactService from "../../../services/contactService.js";

type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });
  const [success,setSuccess] = useState("");
  const [error,setError] = useState(false);

  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  useEffect(() => {

    const timer = setTimeout(() => {
      setSuccess("")
      setError(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [success,error]);


  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const res=await contactService.contact(formData);
      setSuccess(res);
      setFormData({ name: "", email: "", message: "" });
    }
    catch (err) {
        setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-neutral-950 to-zinc-900 px-52 py-6">
      <main className="flex flex-col flex-grow justify-center">
        <h1 className="text-4xl mb-2 text-center font-bold">
          Reach Out & Let’s Talk
        </h1>
        <p className="text-lg text-center text-gray-400 mb-5">
          Feel free to reach out for collaborations, quotes, or inquiries.
        </p>

        <div className="w-20 h-1 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-600 rounded-lg mx-auto mb-8 hover:w-32 transition duration-500" />

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block pb-0.5 text-[17px]">
              Name
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block pb-0.5 text-[17px]">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-10">
            <label htmlFor="message" className="block pb-0.5 text-[17px]">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Type your message here..."
              className="w-full px-3 py-1 rounded-md bg-gray-800 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" className="w-full text-lg font-medium pb-2" disabled={loading}>
            <FiSend size={20} />
            {loading ? "Sending..." : "Send Message"}
          </Button>
          {
            success!=="" && <p className={"text-center text-green-700"}>{success}</p>
          }
          {
            error && <p className={"text-center text-red-600"}>Failed to sent message.Please try again later.</p>
          }
        
        </form>
      </main>
    </section>
  );
}
