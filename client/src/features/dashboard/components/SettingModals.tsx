import type { ReactNode } from "react";
import { X } from "lucide-react";

export default function Modal({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl bg-neutral-900 p-6 border border-white/10">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-white"
        >
          <X size={18} />
        </button>

        {children}
      </div>
    </div>
  );
}
