const WebSocket=require("ws")
const http=require("http")
const jwt=require("jsonwebtoken")
const setupWSConnection=require("y-websocket/bin/utils").setupWSConnection

const JWT_SECRET=""

const server=http.createServer((req,res)=>{
    res.writeHead(200,{"Content-Type":"text/plain"});
    res.end("Yjs WebSocket Sync Server is running!");
});

const wss=new WebSocket.Server({noServer:true});

server.on('upgrade',(request,socket,head)=>{
    const url=new URL(request.url,`ws://${request.header.host}`);
    const token=url.searchParams.get('token');
    if(!token){
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
    }
    try{
        const decoded=jwt.decode(token);

        wss.handleUpgrade(request,socket,head,(ws)=>{
            wss.emit('connection',ws,request);
        });

    }catch(err){
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
    }

})

wss.on('connection',setupWSConnection);

server.listen(1234,()=>{
    console.log("Web Socket Server is Running on PORT 1234")
})
