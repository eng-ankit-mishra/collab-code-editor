import type { RecentCardProps } from "../../../types/Types.ts";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Code, User, Clock, Pencil } from "lucide-react";

export default function RecentCard({
  projects
}: RecentCardProps) {
  const navigate = useNavigate();

  return (
    <>
      {projects.map((p) => {

        return (
          <div
            key={p.id}
            className="w-68 h-44 bg-gray-700/30 border border-white/10 shadow-md hover:scale-[1.02] hover:shadow-xl transition-all cursor-pointer duration-300 p-5 rounded-md flex flex-col justify-between"
            onClick={() => navigate(`/editor/${p.id}`)}
          >

            <div className="relative flex items-center justify-between">
              <span className="text-lg font-semibold text-white truncate">
                {p.name}
              </span>
            </div>

            {/* ---------- META ---------- */}
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
                  {p.ownershipStatus}
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
    </>
  );
}
