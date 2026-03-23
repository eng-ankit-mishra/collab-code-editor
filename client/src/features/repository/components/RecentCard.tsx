import type { RecentCardProps } from "../../../types/Types.ts";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Code, User, Clock, Pencil, Ellipsis } from "lucide-react";
// @ts-ignore
import projectService from "../../../services/projectService";
import RenameModals from "../../dashboard/components/RenameModals.tsx";
import { useState } from "react";

export default function RecentCard({ projects }: RecentCardProps) {
  const navigate = useNavigate();

  const [openId, setOpenId] = useState<string | null>(null);
  const [renameId, setRenameId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!id) return;
    try {
      await projectService.deleteProject(id);
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setOpenId(null);
    }
  }

  return (
      <>
        {projects.map((p) => {
          const isOpen = openId === p.id;

          return (
              <div
                  key={p.id}
                  className={`relative w-68 h-44 bg-gray-700/30 border border-white/10 shadow-md transition-all cursor-pointer duration-300 p-5 rounded-md flex flex-col justify-between ${
                      isOpen
                          ? "z-50 scale-100 shadow-xl"
                          : "z-10 hover:scale-[1.02] hover:shadow-xl"
                  }`}
                  onClick={() => {
                    if (!isOpen) navigate(`/editor/${p.id}`);
                  }}
              >
                <div className="absolute top-3 right-3">
                  <div
                      className="p-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenId(isOpen ? null : p.id);
                      }}
                  >
                    <Ellipsis size={16} />
                  </div>

                  {isOpen && (
                      <ul className="absolute right-0 mt-0 bg-gray-800 rounded shadow-md z-50 border border-gray-600 overflow-hidden w-28">
                        <li
                            onClick={(e) => {
                              e.stopPropagation();
                              setRenameId(p.id);
                              setOpenId(null);
                            }}
                            className="px-3 py-2 text-sm text-white hover:bg-gray-700 cursor-pointer"
                        >
                          Rename
                        </li>

                        <li
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(p.id);
                            }}
                            className="px-3 py-2 text-sm text-red-400 hover:bg-gray-700 cursor-pointer"
                        >
                          Delete
                        </li>
                      </ul>
                  )}
                </div>

                <div className="relative flex items-center justify-between">
              <span className="text-lg font-semibold text-white truncate">
                {p.name}
              </span>
                </div>

                <div className="space-y-1 pt-2 text-sm text-zinc-400">
                  <p className="flex items-center gap-2">
                    <Code size={14} />
                    Language: {p.language.name ?? "Unknown"}
                  </p>

                  <p className="flex items-center gap-2">
                    <Pencil size={14} />
                    Permission: {p.permission}
                  </p>

                  <p className="flex items-center gap-2">
                    <User size={14} />
                    Created by {p.ownerName}
                  </p>
                </div>

                <p className="flex items-center gap-2 text-sm text-zinc-400 mt-3">
                  <Clock size={14} />
                  {formatDistanceToNow(new Date(p.updatedAt ?? 0), {
                    addSuffix: true,
                  })}
                </p>
              </div>
          );
        })}

        {renameId && (
            <RenameModals
                setOpen={() => setRenameId(null)}
                id={renameId}
            />
        )}
      </>
  );
}