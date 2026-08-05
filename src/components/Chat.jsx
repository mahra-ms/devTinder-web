import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants"; // adjust path/name if different

// Small helper component to render single/double tick like WhatsApp
const MessageStatus = ({ status }) => {
  if (status === "seen") {
    return (
      <svg
        className="inline-block ml-1"
        width="16"
        height="11"
        viewBox="0 0 16 11"
        fill="none"
      >
        <path
          d="M1 5.5L4.5 9L11 1"
          stroke="#53BDEB"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 5.5L8.5 9L15 1"
          stroke="#53BDEB"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // "sent" (single grey tick)
  return (
    <svg
      className="inline-block ml-1"
      width="12"
      height="11"
      viewBox="0 0 12 11"
      fill="none"
    >
      <path
        d="M1 5.5L4.5 9L11 1"
        stroke="#8A8FA3"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

function Chat() {
  const { targetUserId } = useParams();
  const user = useSelector((store) => store.user);

  // If your app already keeps a list of connections/matches in redux
  // (e.g. store.connections), try to find the target user there first —
  // avoids an extra network call if you already have the data.
  const connections = useSelector((store) => store.connections);

  const userId = user?._id;

  const socketRef = useRef(null);
  const messageContainerRef = useRef(null);
  const isSendingRef = useRef(false); // guards against double-send

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [targetUser, setTargetUser] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Resolve the other person's name + photo
  useEffect(() => {
    if (!targetUserId) return;

    // 1. Try to find them in an existing redux list first
    const fromStore = connections?.find((c) => c._id === targetUserId);
    if (fromStore) {
      setTargetUser(fromStore);
      return;
    }

    // 2. Fall back to fetching their profile directly
    const fetchTargetUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/${targetUserId}`, {
          withCredentials: true,
        });
        setTargetUser(res.data);
      } catch (err) {
        console.error("Failed to load chat partner profile:", err);
      }
    };

    fetchTargetUser();
  }, [targetUserId, connections]);

  // NEW: load prior chat history on mount.
  // Previously `messages` only ever grew from live socket events, so
  // reopening a conversation always started empty. This assumes a REST
  // endpoint like GET /chat/:targetUserId that returns an array of
  // messages shaped like { id, senderId, text, status, time }.
  // Adjust the URL/response mapping to match your actual backend route.
  useEffect(() => {
    if (!userId || !targetUserId) return;

    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const res = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
          withCredentials: true,
        });

        const history = (res.data?.messages || []).map((m) => ({
          id: m._id || m.id,
          senderId: m.sender || m.senderId,
          text: m.content || m.text,
          status: m.status || "sent",
          time:
            m.time ||
            new Date(m.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
        }));

        setMessages(history);
      } catch (err) {
        console.error("Failed to load chat history:", err);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [userId, targetUserId]);

  useEffect(() => {
    if (!userId || !targetUserId) return;

    socketRef.current = createSocketConnection();

    socketRef.current.emit("joinChat", { userId, targetUserId });

    socketRef.current.on("messageReceived", (message) => {
      setMessages((prev) => [...prev, message]);

      if (message.senderId !== userId) {
        socketRef.current.emit("messageSeen", {
          userId,
          targetUserId,
          messageId: message.id,
        });
      }
    });

    socketRef.current.on("messagesSeen", ({ messageIds }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          messageIds.includes(msg.id) ? { ...msg, status: "seen" } : msg
        )
      );
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    return () => {
      socketRef.current.off("messageReceived");
      socketRef.current.off("messagesSeen");
      socketRef.current.off("connect_error");
      socketRef.current.disconnect();
    };
  }, [userId, targetUserId]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    const text = newMessage.trim();
    if (!text) return;
    if (isSendingRef.current) return;
    isSendingRef.current = true;

    socketRef.current?.emit("sendMessage", {
      firstname: user.firstname,
      userId,
      targetUserId,
      message: text,
    });

    setNewMessage("");

    setTimeout(() => {
      isSendingRef.current = false;
    }, 300);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Fallbacks while targetUser is still loading
  const displayName = targetUser
    ? `${targetUser.firstname || targetUser.firstName || ""} ${
        targetUser.lastname || targetUser.lastName || ""
      }`.trim() || `User ${targetUserId}`
    : `User ${targetUserId}`;

  const displayPhoto =
    targetUser?.photoUrl || targetUser?.photo || "https://i.pravatar.cc/100?img=12";

  return (
    <div className="fixed inset-0 bg-[#0B0D12] overflow-hidden">
      <div className="h-[90%] max-w-4xl mx-auto mt-16 p-4">
        <div className="h-full bg-[#14161D] border border-[#2A2E3A] rounded-3xl flex flex-col overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2E3A] bg-[#171A22] flex-shrink-0">
            <div className="flex items-center gap-3">
              <img
                src={displayPhoto}
                alt={displayName}
                className="w-12 h-12 rounded-full object-cover"
              />

              <div>
                <h2 className="text-white font-semibold text-lg">
                  {displayName}
                </h2>
                <p className="text-[#8A8FA3] text-sm">Online</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={messageContainerRef}
            className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-[#0F1117]"
          >
            {loadingHistory ? (
              <p className="text-[#8A8FA3] text-sm text-center">
                Loading messages...
              </p>
            ) : (
              messages.map((message) => {
                const isMe = message.senderId === userId;

                return (
                  <div
                    key={message.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                        isMe
                          ? "bg-[#7C6CFF] text-white rounded-br-md"
                          : "bg-[#1C1F29] text-white border border-[#2A2E3A] rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm break-words">{message.text}</p>
                      <p className="text-[11px] mt-1 text-right opacity-70 flex items-center justify-end">
                        {message.time}
                        {isMe && <MessageStatus status={message.status} />}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input */}
          <div className="border-t border-[#2A2E3A] bg-[#171A22] p-4 flex-shrink-0">
            <div className="flex gap-3">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1}
                className="flex-1 resize-none rounded-2xl bg-[#1C1F29] border border-[#2A2E3A]
                  text-white placeholder-[#8A8FA3] px-4 py-3 outline-none
                  focus:ring-2 focus:ring-[#7C6CFF]"
              />

              <button
                onClick={handleSend}
                className="bg-[#7C6CFF] hover:bg-[#6B5BFF] text-white px-5 py-3 rounded-2xl transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;