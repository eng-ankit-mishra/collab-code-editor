import type { RecentCardProps } from "./Types";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Code, User, Clock, Ellipsis, Pencil } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import RenameModals from "./RenameModals";

export default function RecentCard({
  project,
  onDelete,
  onRename,
}: RecentCardProps) {
  const navigate = useNavigate();
  const { session } = useAuth();

  const myUserId = session?.user?.id;
  const accessToken = session?.access_token;

  const [showOptionId, setShowOptionId] = useState<string>();
  const [open, setOpen] = useState(false);
  const [currentId, setCurrentId] = useState<string>();

  const cardDropDownRef = useRef<HTMLDivElement>(null);

  /* ---------- CLOSE DROPDOWN ---------- */
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        cardDropDownRef.current &&
        !cardDropDownRef.current.contains(e.target as Node)
      ) {
        setShowOptionId(undefined);
      }
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowOptionId(undefined);
      }
    }

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  /* ---------- DELETE PROJECT (OWNER ONLY) ---------- */
  async function handleDelete(projectId?: string) {
    if (!projectId || !accessToken || !onDelete) return;

    try {
      const res = await fetch(
        `https://codevspace-aqhw.onrender.com/api/projects/${projectId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(await res.text());
      }

      onDelete(projectId);
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  }

  function handleRename(projectId?: string) {
    if (!onRename) return;
    setCurrentId(projectId);
    setOpen(true);
  }

  return (
    <>
      {project.map((p) => {
        const isOwner = p.userId === myUserId;

        return (
          <div
            key={p._id}
            className="w-68 h-44 bg-gray-700/30 border border-white/10 shadow-md hover:scale-[1.02] hover:shadow-xl transition-all cursor-pointer duration-300 p-5 rounded-md flex flex-col justify-between"
            onClick={() => navigate(`/editor/${p._id}`)}
          >
            {/* ---------- TOP ---------- */}
            <div className="relative flex items-center justify-between">
              <span className="text-lg font-semibold text-white truncate">
                {p.projectName}
              </span>

              <button
                className="text-gray-400 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowOptionId((prev) =>
                    prev === p._id ? undefined : p._id
                  );
                }}
              >
                <Ellipsis size={16} />
              </button>

              {showOptionId === p._id && (
                <div
                  ref={cardDropDownRef}
                  className="absolute left-40 top-full mt-1 bg-neutral-900 rounded shadow"
                >
                  <ul className="p-2 min-w-[120px]">
                    {isOwner ? (
                      <>
                        {onRename && (
                          <li
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRename(p._id);
                            }}
                            className="hover:bg-gray-800 text-sm px-3 py-1 rounded cursor-pointer"
                          >
                            Rename
                          </li>
                        )}

                        {onDelete && (
                          <li
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(p._id);
                            }}
                            className="hover:bg-gray-800 text-sm px-3 py-1 rounded cursor-pointer text-red-400"
                          >
                            Delete
                          </li>
                        )}
                      </>
                    ) : (
                      <li className="text-sm px-3 py-1 text-zinc-400 cursor-default">
                        Shared project
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* ---------- META ---------- */}
            <div className="space-y-1 pt-2 text-sm text-zinc-400">
              <p className="flex items-center gap-2">
                <Code size={14} />
                Language: {p.template?.name ?? "Unknown"}
              </p>

              <p className="flex items-center gap-2">
                <Pencil size={14} />
                Permission: {isOwner ? "Owner" : "Collaborator"}
              </p>

              <p className="flex items-center gap-2">
                <User size={14} />
                {isOwner ? "Created by you" : "Shared with you"}
              </p>
            </div>

            {/* ---------- TIME ---------- */}
            <p className="flex items-center gap-2 text-sm text-zinc-400 mt-3">
              <Clock size={14} />
              {formatDistanceToNow(
                new Date(p.updatedAt ?? 0),
                { addSuffix: true }
              )}
            </p>
          </div>
        );
      })}

      {open && onRename && (
        <RenameModals
          setOpen={setOpen}
          id={currentId}
          onRename={onRename}
        />
      )}
    </>
  );
}
