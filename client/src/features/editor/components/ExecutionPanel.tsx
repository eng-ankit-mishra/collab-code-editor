import Button from "../../../components/ui/Button.tsx";
import { type JSX } from "react";
import { Play } from "lucide-react";
import Chat from "./Chat.tsx";

type OutputProps = {
  onClick: () => void;
  output: string;
  input: string;
  setInput: (val: string) => void;
  bgClass: string;
  isLoading: boolean;
  roomId?: string;
  accessRole?: "OWNER" | "EDITOR" | "VIEWER";
};

export default function ExecutionPanel({
  onClick,
  output,
  input,
  setInput,
  bgClass,
  isLoading,
  roomId,
}: OutputProps): JSX.Element {

  return (
    <main className="w-[34rem] h-full pt-3 p-4 flex flex-col gap-2">
      {/* RUN BUTTON */}
      <Button
        className="h-8 px-3 w-18"
        onClick={onClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
        ) : (
          <>
            <Play size={16} /> Run
          </>
        )}
      </Button>

      {/* INPUT */}
      <div className="p-4 mt-2 text-sm rounded-xl border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
        <h1 className="pb-2 text-base border-b border-white/10 font-medium">
          Input
        </h1>

        <textarea
          className="w-full h-auto pt-2 bg-transparent text-white outline-none resize-none whitespace-pre-wrap"
          placeholder={
            "Write input here"
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      {/* OUTPUT */}
      <div className="flex-1 overflow-y-auto p-4 text-sm rounded-xl border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
        <h1 className="pb-2 text-base border-b border-white/10 font-medium">
          Output
        </h1>
        <pre className={`whitespace-pre-wrap pt-2 ${bgClass}`}>
          {output}
        </pre>
      </div>

      <Chat roomId={roomId} />
    </main>
  );
}
