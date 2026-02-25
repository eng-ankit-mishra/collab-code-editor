import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Output from "./Output";
import { executeCode } from "./Api";
import type { editor } from "monaco-editor";
import Editor from "@monaco-editor/react";
import type { codeAreaProps } from "./Types";
import { formatDistanceToNow } from "date-fns";
import debounce from "lodash/debounce";
import { useAuth } from "../context/useAuth";
import { getSocket } from "../socket/socket_temp";
import { useDebounce } from "./useDebounce";
import { FaCloudUploadAlt } from "react-icons/fa";
import Button from "./Button";
import { Download } from "lucide-react";

/* ============================================================
   CODE AREA COMPONENT
   ============================================================ */

export default function CodeArea({
  projectObject,
  accessRole,
}: codeAreaProps) {
  /* ---------- ROLE LOGIC ---------- */
  const canEdit = accessRole === "OWNER" || accessRole === "EDITOR";
  const isReadOnly = accessRole === "VIEWER";

  /* ---------- STATE ---------- */
  const [value, setValue] = useState<string>(
    projectObject.code?.trim()
      ? projectObject.code
      : projectObject.template?.boilerplate || ""
  );

  const debouncedCode = useDebounce(value, 2000);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const isRemoteUpdate = useRef(false);

  const [input, setInput] = useState("");
  const [output, setOutput] = useState(
    "Press the 'Run' button to execute your code."
  );
  const [consoleText, setConsoleText] = useState("text-white");
  const [loading, setLoading] = useState(false);

  /* ---------- LAST UPDATE INFO ---------- */
  const [lastUpdateInfo, setLastUpdateInfo] = useState<{
    time?: Date;
    userName?: string;
  }>({});

  const { session } = useAuth();
  const accessToken = session?.access_token;

  /* ---------- SOCKET ---------- */
  const socket = getSocket();

  /* =====================================
     INITIALIZE LAST UPDATE FROM BACKEND
     ===================================== */
  useEffect(() => {
    if (projectObject.updatedAt) {
      setLastUpdateInfo({
        time: new Date(projectObject.updatedAt),
        userName: projectObject.lastUpdatedBy?.userName,
      });
    }
  }, [projectObject]);

  /* =====================================
     JOIN ROOM + RECEIVE CODE UPDATES
     ===================================== */
  useEffect(() => {
    if (!socket || !projectObject._id) return;

    socket.emit("join-room", { roomId: projectObject._id });

    socket.on("code-change", (incomingCode: string) => {
      const current = editorRef.current?.getValue();
      if (incomingCode !== current) {
        isRemoteUpdate.current = true;
        setValue(incomingCode);
      }
    });

    return () => {
      socket.off("code-change");
    };
  }, [socket, projectObject._id]);

  /* =====================================
     SAVE CODE (EDITORS ONLY)
     ===================================== */
  useEffect(() => {
    if (!canEdit || !accessToken) return;

    const saveCode = async () => {
      try {
        await axios.put(
          `https://codevspace-aqhw.onrender.com/api/projects/${projectObject._id}`,
          { code: debouncedCode },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // ✅ Instant UI update
        setLastUpdateInfo({
          time: new Date(),
          userName:
            
            session?.user?.email ||
            "You",
        });
      } catch (err) {
        console.error("Save failed:", err);
      }
    };

    saveCode();
  }, [debouncedCode, accessToken, projectObject._id, canEdit]);

  /* =====================================
     EMIT CODE CHANGE (DEBOUNCED)
     ===================================== */
  const emitChangeRef = useRef(
    debounce((val: string) => {
      const socket = getSocket();
      if (!socket) return;

      socket.emit("code-change", {
        roomId: projectObject._id,
        code: val,
      });
    }, 300)
  );

  function handleChange(val: string) {
    if (!canEdit) return;

    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }

    setValue(val);
    emitChangeRef.current(val);
  }

  /* =====================================
     RUN CODE
     ===================================== */
  const runCode = async () => {
    if (!editorRef.current) return;

    setLoading(true);
    try {
      const { id} = projectObject.template;

      const { run } = await executeCode(
        {id},
        editorRef.current.getValue(),
        input
      );

      setConsoleText(run.stderr ? "text-red-500" : "text-white");
      setOutput(run.output);
    } catch (err) {
      console.error(err);
      setConsoleText("text-red-500");
      setOutput("Error running code.");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================
     DOWNLOAD
     ===================================== */
 function handleDownload() {
  const code = editorRef.current?.getValue() || "";

  const extension =
    projectObject.template?.alias || "txt";

  const fileName = `${projectObject.projectName}.${extension}`;

  const blob = new Blob([code], {
    type: "text/plain",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
}


  /* =====================================
     UI
     ===================================== */
  return (
    <main className="w-full h-full flex gap-1">
      <div className="w-[56rem] flex flex-col px-4 gap-4">
        {/* HEADER */}
        <div className="flex items-center gap-4 mt-3">
          <Button onClick={handleDownload}>
            <Download size={16} /> Download
          </Button>

          <p className="pr-8 text-gray-300 text-sm flex gap-2 items-center">
            <FaCloudUploadAlt size={18} />
            Last updated
            {/* {lastUpdateInfo.userName && (
              <>
                {" "}
                by{" "}
                <span className="font-medium">
                  {lastUpdateInfo.userName}
                </span>
              </>
            )} */}
            <span>
              {lastUpdateInfo.time
                ? formatDistanceToNow(lastUpdateInfo.time, {
                    addSuffix: true,
                  })
                : "—"}
            </span>
          </p>

          {isReadOnly && (
            <p className="text-xs text-yellow-400">
              View-only access — ask the owner for edit permission
            </p>
          )}
        </div>

        {/* EDITOR */}
        <div className="h-[38rem] rounded-xl border border-white/10">
          <Editor
            theme="vs-dark"
            height="100%"
            language={projectObject.template.name.toLowerCase()}
            value={value}
            onMount={(editor) => (editorRef.current = editor)}
            onChange={
              isReadOnly ? undefined : (val) => handleChange(val || "")
            }
            options={{
              readOnly: isReadOnly,
              minimap: { enabled: false },
            }}
          />
        </div>
      </div>

      {/* OUTPUT */}
      <Output
        onClick={runCode}
        output={output}
        input={input}
        setInput={setInput}
        bgClass={consoleText}
        isLoading={loading}
        roomId={projectObject._id}
        accessRole={accessRole}
      />
    </main>
  );
}
