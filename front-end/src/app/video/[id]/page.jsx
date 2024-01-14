"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function VideoPage() {
   const SERVER_URL = "/";
   const videoId = useParams().id;
   const searchParams = useSearchParams();

   const isPartyText = searchParams.get("party");

   const videoRef = useRef(null);
   const [ws, setWs] = useState(null);
   const isUpdating = useRef(false);
   const isSeeking = useRef(false); // Define isSeeking ref

   const [title, setTitle] = useState("Title");
   const [description, setDescription] = useState("Description");

   const [isChatOn, setIsChatOn] = useState(false);

   const [chatMessages, setChatMessages] = useState([]); // State to store chat messages
   const [newMessage, setNewMessage] = useState(''); // State for the new message input

   useEffect(() => {
      const websocket = new WebSocket('ws://localhost:3000');
      setWs(websocket);

      websocket.onopen = () => {
         websocket.send(JSON.stringify({ type: 'JOIN', streamId: videoId }));
      };

      websocket.onmessage = (event) => {
         isUpdating.current = true;
         const data = JSON.parse(event.data);

         switch (data.type) {
            case 'PLAY':
               videoRef.current.currentTime = data.currentTime;
               videoRef.current.play();
               break;
            case 'PAUSE':
               videoRef.current.currentTime = data.currentTime;
               videoRef.current.pause();
               break;
            case 'SEEK':
               if (!isSeeking.current) {
                  videoRef.current.currentTime = data.currentTime;
                  videoRef.current.play();
               }
               break;
            case 'CHAT_MESSAGE':
               // Add the incoming chat message to the chatMessages state
               setChatMessages((prevMessages) => [...prevMessages, data]);
               break;
            default:
               console.log("Received unknown message type:", data.type);
         }
         setTimeout(() => isUpdating.current = false, 300);
      };

      return () => {
         websocket.close();
      };
   }, []);

   const handlePlay = () => {
      if (!isUpdating.current) {
         const currentTime = videoRef.current?.currentTime || 0;
         ws?.send(JSON.stringify({ type: 'PLAY', currentTime }));
      }
   };

   const handlePause = () => {
      if (!isUpdating.current) {
         const currentTime = videoRef.current?.currentTime || 0;
         ws?.send(JSON.stringify({ type: 'PAUSE', currentTime }));
      }
   };

   const handleSeek = (seekTime) => {
      if (!isUpdating.current && ws) {
         isSeeking.current = true;
         videoRef.current.currentTime = seekTime;
         videoRef.current.play();
         ws.send(JSON.stringify({ type: 'SEEK', currentTime: seekTime }));
         setTimeout(() => {
            isSeeking.current = false;
         }, 300);
      }
   };
   const sendChatMessage = () => {
      const message = {
         type: 'CHAT_MESSAGE',
         content: newMessage,
         timestamp: videoRef.current?.currentTime || 0
      };
      setChatMessages((prevMessages) => [...prevMessages, message]);
      console.log(chatMessages);
      ws?.send(JSON.stringify(message));
      setNewMessage(''); // Clear the message input after sending
   };


   return (
      <div className="overflow-hidden h-[100svh]">
         <main className="md:w-[60%]">
            <video
               ref={videoRef}
               width="100%"
               controls
               onPlay={handlePlay}
               onPause={handlePause}
               onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const offsetX = e.clientX - rect.left;
                  const width = rect.width;
                  const seekTime = (offsetX / width) * videoRef.current.duration;
                  handleSeek(seekTime);
               }}
               muted
            >
               <source src={`http://localhost:3000/api/streams/${videoId}`} type="video/mp4" />
               Your browser does not support the video tag.
            </video>
         </main>
         <div className="chat-container">
                <div className="chat-messages">
                    {chatMessages.map((msg, index) => (
                        <div key={index} className="chat-message">
                            <span className="chat-timestamp">[{msg.timestamp.toFixed(2)}]</span>
                            <span className="chat-content">{msg.content}</span>
                        </div>
                    ))}
                </div>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={sendChatMessage}>Send</button>
            </div>
      </div>
   );
}

export default VideoPage;
