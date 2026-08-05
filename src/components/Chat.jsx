import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

import { createSocketConnection } from "../utils/socket";
import { BASE_URL } from "../utils/constants";

// -------------------- Message Status --------------------
const MessageStatus = ({ status }) => {
  return status === "seen" ? (
    <span className="text-sky-400 ml-1">✓✓</span>
  ) : (
    <span className="text-gray-400 ml-1">✓</span>
  );
};

// -------------------- Chat Component --------------------
function Chat() {
  const { targetUserId } = useParams();
  const location = useLocation();

  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const socketRef = useRef(null);
  const messageContainerRef = useRef(null);
  const isSendingRef = useRef(false); // "send once" guard
  const notifiedSeenIdsRef = useRef(new Set()); // avoid re-emitting "seen" for the same id

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // User data passed from Connections.jsx
  const [targetUser, setTargetUser] = useState(location.state || null);

  // ------------------------------------------------------
  // Fetch Chat History
  // ------------------------------------------------------
  useEffect(() => {
    if (!userId || !targetUserId) return;

    let cancelled = false;

    const fetchChat = async () => {
      setLoading(true);

      try {
        const res = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
          withCredentials: true,
        });

        const msgs = res.data?.messages || [];

        const otherUser = msgs
          .map((msg) => msg.sender)
          .find((sender) => sender?._id !== userId);

        if (!cancelled && otherUser) {
          setTargetUser({
            _id: otherUser._id,
            fullName: `${otherUser.firstName || ""} ${
              otherUser.lastName || ""
            }`.trim(),
            photo: otherUser.photoUrl || "",
          });
        }

        const formattedMessages = msgs.map((msg) => ({
          id: msg._id,
          senderId: msg.sender?._id,
          text: msg.content,
          status: msg.status || "sent",
          time: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));

        if (!cancelled) {
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Error loading chat:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchChat();

    return () => {
      cancelled = true;
    };
  }, [userId, targetUserId]);

  // ------------------------------------------------------
  // Socket Connection
  // ------------------------------------------------------
  useEffect(() => {
    if (!userId || !targetUserId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.emit("joinChat", { userId, targetUserId });

    // Receive new message (seen-marking is handled separately below,
    // by the effect that watches `messages` — not here)
    socket.on("messageReceived", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Update seen status for messages I sent
    socket.on("messagesSeen", ({ messageIds }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          messageIds.includes(msg.id) ? { ...msg, status: "seen" } : msg
        )
      );
    });

    socket.on("connect_error", (err) => {
      console.error("Socket Error:", err.message);
    });

    return () => {
      socket.off("messageReceived");
      socket.off("messagesSeen");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  // ------------------------------------------------------
  // Mark incoming messages as seen
  // Runs whenever `messages` changes — covers BOTH messages loaded
  // from history on mount AND new ones arriving live, so nothing
  // is missed just because it wasn't a fresh socket event.
  // ------------------------------------------------------
  useEffect(() => {
    if (!socketRef.current || !userId || !targetUserId) return;

    const unseen = messages.filter(
      (msg) =>
        msg.senderId !== userId &&
        msg.status !== "seen" &&
        !notifiedSeenIdsRef.current.has(msg.id)
    );

    if (unseen.length === 0) return;

    unseen.forEach((msg) => notifiedSeenIdsRef.current.add(msg.id));

    socketRef.current.emit("messageSeen", {
      userId,
      targetUserId,
      messageIds: unseen.map((msg) => msg.id),
    });
  }, [messages, userId, targetUserId]);

  // ------------------------------------------------------
  // Auto Scroll
  // ------------------------------------------------------
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // ------------------------------------------------------
  // Send Message
  // ------------------------------------------------------
  const handleSend = () => {
    const text = newMessage.trim();

    if (!text || !socketRef.current) return;
    if (isSendingRef.current) return; // block accidental double-fire
    isSendingRef.current = true;

    socketRef.current.emit("sendMessage", {
      firstname: user.firstName,
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

  // ------------------------------------------------------
  // Display Values
  // ------------------------------------------------------
  const displayName = targetUser?.fullName || "User";

  const displayPhoto =
    targetUser?.photo ||
    "https://static.vecteezy.com/system/resources/previews/036/280/651/original/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg";

  // ------------------------------------------------------
  // UI
  // ------------------------------------------------------
  return (
    <div className="fixed inset-0 bg-[#0B0D12] overflow-hidden">
      <div className="h-[90%] max-w-4xl mx-auto mt-16 p-4">
        <div className="h-full bg-[#14161D] border border-[#2A2E3A] rounded-3xl flex flex-col overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-[#2A2E3A] bg-[#171A22]">
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

          {/* Messages */}
          <div
            ref={messageContainerRef}
            className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-[#0F1117]"
          >
            {loading ? (
              <p className="text-center text-[#8A8FA3]">
                Loading messages...
              </p>
            ) : messages.length === 0 ? (
              <p className="text-center text-[#8A8FA3]">
                Start the conversation 👋
              </p>
            ) : (
              messages.map((message) => {
                const isMe = message.senderId === userId;

                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                        isMe
                          ? "bg-[#7C6CFF] text-white rounded-br-md"
                          : "bg-[#1C1F29] text-white border border-[#2A2E3A] rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm break-words">{message.text}</p>

                      <div className="text-[11px] mt-1 text-right opacity-70 flex items-center justify-end">
                        {message.time}
                        {isMe && <MessageStatus status={message.status} />}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input */}
          <div className="border-t border-[#2A2E3A] bg-[#171A22] p-4">
            <div className="flex gap-3">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1}
                className="flex-1 resize-none rounded-2xl bg-[#1C1F29] border border-[#2A2E3A] text-white placeholder-[#8A8FA3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#7C6CFF]"
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