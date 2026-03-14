import { useEffect, useRef, useState } from "react";
import { getSocket } from "../sockets/socket_temp.ts";
import { IoSend } from "react-icons/io5";
import { useAuth } from "../../auth/context/useAuth.tsx";

type ChatMessage = {
  user: string;
  text: string;
  time: string;
  userId: string;
};

export default function Chat({ roomId }: { roomId?: string }) {
  const socket = getSocket();
  const { session } = useAuth();

  const myUserId = session?.user?.id;
  const myUserName = session?.user?.user_metadata?.name || "Me"; // Fallback name

  /* ✅ FIX PART 1: Create a Ref to track the live User ID 
     This allows the socket listener to read the current ID 
     without getting stuck in a "stale closure".
  */
  const userIdRef = useRef(myUserId);

  // Keep the ref updated whenever session changes
  useEffect(() => {
    userIdRef.current = myUserId;
  }, [myUserId]);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  /* 🔥 LOAD CHAT HISTORY */
  useEffect(() => {
    if (!roomId || !session?.access_token) return;

    fetch(
      `https://codevspace-aqhw.onrender.com/api/projects/${roomId}/chat`,
      {
        headers: { Authorization: `Bearer ${session.access_token}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const history = data.map((m: any) => ({
          user: m.userName,
          text: m.text,
          time: m.createdAt,
          userId: m.userId,
        }));
        setMessages(history);
      })
      .catch((err) => console.error("❌ Failed to load chat:", err));
  }, [roomId, session]);

  /* 🔌 REALTIME MESSAGES */
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (msg: ChatMessage) => {
      /* ✅ FIX PART 2: Compare against userIdRef.current 
         This ensures we are checking against the actual logged-in ID,
         even if it loaded asynchronously after the socket connected.
      */
      if (userIdRef.current && msg.userId === userIdRef.current) {
        return; // Ignore my own message (we already added it optimistically)
      }

      setMessages((prev) => [...prev, msg]);
    };

    socket.on("chat-message", handleMessage);
    return () => {
      socket.off("chat-message", handleMessage);
    };
  }, [socket]); // Dependency array is clean now

  /* 🔽 AUTO SCROLL */
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* 📤 SEND MESSAGE */
  function sendMessage() {
    if (!text.trim() || !roomId || !socket) return;

    // 1. Optimistic Update (Show immediately)
    const optimisticMsg: ChatMessage = {
      user: myUserName,
      text: text,
      time: new Date().toISOString(),
      userId: myUserId || "temp-id", // Ensure string type
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setText("");

    // 2. Send to server
    socket.emit("chat-message", { roomId, text });
  }

  if (!socket) return null;

  return (
    <section className="flex flex-col h-[16rem] px-4 py-3 border border-white/10 rounded-xl">
      <h1 className="pb-1.5 text-base border-b border-white/10 font-medium mb-3">
        Project Chat
      </h1>

      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((m, i) => {
          // Use the variable directly here for rendering
          const isMe = m.userId === myUserId;

          return (
            <div
              key={i}
              className={`max-w-[75%] px-3 py-1.5 flex items-center justify-between gap-4 rounded-lg text-sm ${
                isMe
                  ? "ml-auto bg-green-900 text-white text-right"
                  : "mr-auto bg-neutral-800 text-white"
              }`}
            >
              <div className="text-left break-words">{m.text}</div>
              <div className="text-left text-xs text-zinc-300 mt-1 ">
                {isMe ? "You" : m.user} •{" "}
                {new Date(m.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <div className="flex gap-3 pt-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 bg-transparent border border-white/40 px-2 py-1 rounded-md text-sm"
          placeholder="Type a message..."
        />
        <button
          className="bg-green-800 hover:bg-green-600 rounded-2xl p-2"
          onClick={sendMessage}
        >
          <IoSend />
        </button>
      </div>
    </section>
  );
}