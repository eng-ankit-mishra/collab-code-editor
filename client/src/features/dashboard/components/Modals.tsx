import Button from "../../../components/ui/Button.tsx";
import { PlusCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {useState, useEffect, type FormEvent} from "react";
import { getRuntimes } from "../../../utils/languages.ts";
import type { Language, ModalProps, ProjectDetails } from "../../../types/Types.ts";

export default function Modals({ setShowModals, create }: ModalProps) {
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);

  const [languages, setLanguages] = useState<Language[]>([]);
  const [lang, setLang] = useState<Language | null>(null); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRuntimes().then((data) => {
      setLanguages(data);
      if (data.length > 0) {
        setLang(data[0]); 
      }
    });
  }, []);

  useEffect(() => {
    if (isError) {
      const timer = setTimeout(() => setIsError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isError]);

  async function handleSubmit(e:FormEvent<HTMLFormElement>) {
      e.preventDefault();
    setLoading(true);

    const formData=new FormData(e.currentTarget)

    const name = formData.get("project") as string
      const description=formData.get("description") as string

    if (!name || !lang) {
      setIsError(true);
      setLoading(false);
      return;
    }

    const projectObj: ProjectDetails = {
      name,
      description,
      language:lang,
      codeContent:lang.boilerplate
    };

    try {
      const projectId = await create(projectObj);
      console.log(projectId);
      if (projectId) {
        navigate(`/editor/${projectId}`)
        setShowModals(false);
      } else {
        setIsError(true);
      }
    } catch (err) {
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  function handleLangChange(selectedLang: Language) {
    setLang(selectedLang);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="w-md bg-neutral-900  px-6 py-8 rounded-xl relative border border-white/10 shadow-md">
        <button
          className="absolute top-5 right-5 cursor-pointer"
          onClick={() => setShowModals(false)}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <form
          className="space-y-2"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-1.5">
            <h2 className="text-2xl font-semibold mb-4">Create New Project</h2>

            <label htmlFor="project" className="block ">
              Enter Project Name
            </label>
            <input
              id="project"
              name="project"
              type="text"
              autoComplete="off"
              placeholder="Project Name"
              className="py-1 px-3 bg-gray-900 text-white placeholder-gray-400 border border-white/20 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
              required
              disabled={loading}
            />
              <label htmlFor="description" className="block ">
                  Enter Project Description
              </label>
              <input
                  id="description"
                  name="description"
                  type="text"
                  autoComplete="off"
                  placeholder="Project Description"
                  className="py-1 px-3 bg-gray-900 text-white placeholder-gray-400 border border-white/20 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                  disabled={loading}
              />


            <label htmlFor="template" className="block  mt-5">
              Select Template
            </label>

            <div className="grid grid-cols-3 gap-12 gap-x-16 py-8 p-6">
              {languages.map((item) => {
                const Icon = item.icon;

                if (Icon) {
                  return (
                    <div key={item.name} className="flex flex-col items-center justify-center gap-2">
                      <div
                        onClick={() => handleLangChange(item)}
                        className={`p-2 rounded cursor-pointer border transition-all duration-200
                      ${
                        
                        lang?.name === item.name
                          ? "border-blue-400 bg-blue-900/30 shadow-[0_0_0_2px_#3b82f6]"
                          : "hover:bg-neutral-800 border-white/20"
                      }`}
                      >
                        <Icon size={28} className={item.color} />
                      </div>
                      <p className="text-xs text-gray-200">{item.name}</p>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-8 block">
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin mx-auto" />
            ) : (
              <div className="flex items-center justify-center gap-2">
                <PlusCircle size={18} /> Create
              </div>
            )}
          </Button>

          {isError && (
            <p className="text-red-500 pt-4 text-sm">
              Something went wrong. Please try again later.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}