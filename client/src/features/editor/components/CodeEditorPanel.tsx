import {useEffect, useRef, useState} from "react";
import ExecutionPanel from "./ExecutionPanel.tsx";
import type {editor} from "monaco-editor";
import Editor from "@monaco-editor/react";
import {type codeAreaProps} from "../../../types/Types.ts";
import {formatDistanceToNow} from "date-fns";
import {useDebounce} from "../../../hooks/useDebounce.ts";
import {FaCloudUploadAlt} from "react-icons/fa";
import Button from "../../../components/ui/Button.tsx";
import {Download} from "lucide-react";
import {useAuth} from "../../auth/context/useAuth.tsx"
// @ts-ignore
import projectService from "../../../services/projectService";

import * as Y from "yjs"
import {WebsocketProvider} from "y-websocket"
import {MonacoBinding} from "y-monaco"


export default function CodeEditorPanel({
  projectObject,
}: codeAreaProps) {

  const {session,userDetail}=useAuth();

  const [value, setValue] = useState<string>(
    projectObject.codeContent
  );

  const role = projectObject.collaborators?.find(
      (c) => c.userId === userDetail?.id
  )?.role;

  console.log(role)


  const isFirstRender=useRef(true);

  const debouncedCode = useDebounce(value, 2000);


  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const providerRef=useRef<WebsocketProvider | null>(null)
  const bindingRef=useRef<MonacoBinding | null>(null)


  const [input, setInput] = useState("");
  const [output, setOutput] = useState(
    "Press the 'Run' button to execute your code."
  );
  const [consoleText, setConsoleText] = useState("text-white");
  const [loading, setLoading] = useState(false);

  const [lastUpdateInfo, setLastUpdateInfo] = useState<{
    time?: Date;
    userName?: string;
  }>({});



  useEffect(() => {
    if (projectObject.updatedAt) {
      setLastUpdateInfo({
        time: new Date(projectObject.updatedAt)
      });
    }
  }, [projectObject]);

  useEffect(() => {
    return ()=>{
      bindingRef.current?.destroy()
      providerRef.current?.destroy()
    };
  }, []);



  useEffect(() => {
    if(isFirstRender.current) {
        isFirstRender.current = false;
        return;
    }
    const saveCode = async () => {
      try {
        await projectService.saveCode(projectObject.id,debouncedCode)
        setLastUpdateInfo({
          time: new Date()
        });
      } catch (err) {
        console.error("Save failed:", err);
      }
    };
    void saveCode();
  }, [debouncedCode, projectObject.id]);



  function handleEditorMount(editorInstance:editor.IStandaloneCodeEditor) {
    editorRef.current=editorInstance;

    const ydoc=new Y.Doc();

    const wsProtocol= window.location.protocol === "https:" ? "wss://" : "ws://"

    const serverUrl=`${wsProtocol}socket.codevspace.codes/ws`;

    const roomName=`${projectObject.id}?token=${session || ""}`;

    const provider = new WebsocketProvider(
        serverUrl,
        roomName,
        ydoc
    )

    providerRef.current=provider;

    const ytext=ydoc.getText("monacco")

    provider.on("sync",(isSynced:boolean)=>{
      if(isSynced && ytext.length===0 && projectObject.codeContent){
        ytext.insert(0,projectObject.codeContent);
      }
    })

    const binding=new MonacoBinding(
      ytext,
      editorRef.current.getModel()!,
      new Set([editorRef.current]),
      provider.awareness
    );

    bindingRef.current=binding;

    provider.awareness.setLocalStateField("user" ,{
      name:userDetail?.name || "Anonymous",
      color: "#" + Math.floor(Math.random()* 16777215).toString(16),
    });




  }

  /* =====================================
     RUN CODE
     ===================================== */
  const runCode = async () => {
    if (!editorRef.current) return;

    setLoading(true);
    try {

      const result=await projectService.executeCode(projectObject.id,{languageId:projectObject.language.id,sourceCode:editorRef.current.getValue(),stdin:input});

      if (result.compileOutput) {
        setConsoleText("text-red-500");
        setOutput(result.compileOutput);
      } else if (result.stderr) {
        setConsoleText("text-red-500");
        setOutput(result.stderr);
      } else {
        setConsoleText("text-white");
        setOutput(result.stdout || "Execution finished with no output.");
    }} catch (err) {
      console.error(err);
      setConsoleText("text-red-500");
      setOutput("Error running code.");
    } finally {
      setLoading(false);
    }
  };

 function handleDownload() {
  const code = editorRef.current?.getValue() || "";

  const extension =
    projectObject.language?.alias || "txt";

  const fileName = `${projectObject.name}.${extension}`;

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
            <span>
              {lastUpdateInfo.time
                ? formatDistanceToNow(lastUpdateInfo.time, {
                    addSuffix: true,
                  })
                : "—"}
            </span>
          </p>

          {role==="VIEWER" && (
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
            language={projectObject.language.name.toLowerCase()}
            defaultValue={projectObject.codeContent}
            onMount={handleEditorMount}
            onChange={
              (val) => setValue(val || "")
            }
            options={{
              minimap: { enabled: false },
              readOnly: role==="VIEWER",
            }}
          />
        </div>
      </div>

      <ExecutionPanel
        onClick={runCode}
        output={output}
        input={input}
        setInput={setInput}
        bgClass={consoleText}
        isLoading={loading}
        roomId={projectObject.id}
      />
    </main>
  );
}
