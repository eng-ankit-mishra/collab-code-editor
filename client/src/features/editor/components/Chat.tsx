import { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { useAuth } from "../../auth/context/useAuth.tsx";
import type {ChatMessage} from "../../../types/Types.ts"
// @ts-ignore
import chatService from "../../../services/chatService.js"
import {Client} from "@stomp/stompjs";
// @ts-ignore
import SockJS from "sockjs-client";


export default function Chat({ roomId }: { roomId?: string }) {

  const { session,userDetail } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  const stompClientRef=useRef<Client | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!roomId) return;

    const fetchChats = async () => {
      try{
        const data=await chatService.getAllChatHistory(roomId)
        console.log(data)
        setMessages(data)
      }catch (err:any){
        console.log(err)
      }
    }

    void fetchChats()

    const client=new Client({
      webSocketFactory:() => {
          // Strip out any quotes just in case the session string has them
          const safeToken = session ? session.replace(/['"]+/g, '').trim() : "";
          return new SockJS(`https://codevspace.codes/api/ws?token=${safeToken}`);
      },
      connectHeaders:{
        Authorization: `Bearer ${session}`
      },
      onConnect:()=>{
        console.log("Connected to chat room" + roomId);

        client.subscribe(`/topic/projects/${roomId}`,(msg)=>{
          const newChat=JSON.parse(msg.body);

          setMessages(prev=>{
            if(prev.some(m=>m.id===newChat.id)) return prev;
            return [...prev,newChat];
          })

        })
      },
      onStompError:(frame)=>{
        console.log("Broken Error",frame.body);
    }}
    );

    client.activate();
    stompClientRef.current=client;

    return ()=>{
      void client.deactivate();
    }

  }, [roomId,session]);


  async function sendMessage(){
    if(!text.trim()){
      return;
    }

    if(stompClientRef.current && stompClientRef.current.connected){
      const payload={
        content:text
      }
      stompClientRef.current.publish({
        destination:`/app/chat/${roomId}/sendMessage`,
        body: JSON.stringify(payload),
      })
      setText("");
    }else{
      console.log("Websocket not connected");
    }

  }

  return (
    <section className="flex flex-col h-[16rem] px-4 py-3 border border-white/10 rounded-xl">
      <h1 className="pb-1.5 text-base border-b border-white/10 font-medium mb-3">
        Project Chat
      </h1>

      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((m, i) => {
          const isMe = m.senderId === userDetail?.id;

          return (
            <div
              key={i}
              className={`max-w-[75%] px-3 py-1.5 flex items-center justify-between gap-4 rounded-lg text-sm ${
                isMe
                  ? "ml-auto bg-green-900 text-white text-right"
                  : "mr-auto bg-neutral-800 text-white"
              }`}
            >
              <div className="text-left break-words">{m.content}</div>
              <div className="text-left text-xs text-zinc-300 mt-1 ">
                {isMe ? "You" : m.senderName} •{" "}
                {new Date(m.createdAt).toLocaleTimeString([], {
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