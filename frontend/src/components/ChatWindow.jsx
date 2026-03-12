import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import io from "socket.io-client";
import { FiSend } from "react-icons/fi";
import { format } from "timeago.js";

const SOCKET_URL = "http://localhost:5000";

export default function ChatWindow({ chat }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState("");
  const messagesEnd = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!chat) return;

    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit("joinChat", chat._id);

    socketRef.current.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socketRef.current.on("userTyping", ({ userName }) => {
      setTyping(`${userName} is typing...`);
    });

    socketRef.current.on("userStopTyping", () => {
      setTyping("");
    });

    return () => {
      socketRef.current.emit("leaveChat", chat._id);
      socketRef.current.disconnect();
    };
  }, [chat]);

  useEffect(() => {
    if (!chat) return;
    API.get(`/chats/${chat._id}/messages`).then((res) => setMessages(res.data));
  }, [chat]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await API.post(`/chats/${chat._id}/messages`, { text });
      setText("");
      socketRef.current.emit("stopTyping", { chatId: chat._id });
    } catch (err) {
      console.error(err);
    }
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    socketRef.current.emit("typing", {
      chatId: chat._id,
      userName: user.name,
    });

    clearTimeout(window._typingTimeout);
    window._typingTimeout = setTimeout(() => {
      socketRef.current.emit("stopTyping", { chatId: chat._id });
    }, 1500);
  };

  if (!chat) {
    return (
      <div className="no-chat-selected">Select a chat to start messaging</div>
    );
  }

  const otherUser = chat.participants?.find((p) => p._id !== user._id);

  return (
    <div className="chat-window">
      <div className="chat-window-header">
        <img
          src={
            otherUser?.avatar ||
            `https://ui-avatars.com/api/?name=${otherUser?.name}&background=23e5db&color=002f34`
          }
          alt=""
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <div>
          <div style={{ fontWeight: 600 }}>{otherUser?.name}</div>
          <div style={{ fontSize: 12, color: "#7f9799" }}>
            {chat.ad?.title} — Rs {chat.ad?.price?.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`message ${
              msg.sender?._id === user._id || msg.sender === user._id
                ? "sent"
                : "received"
            }`}
          >
            {msg.text}
            <div className="message-time">{format(msg.createdAt)}</div>
          </div>
        ))}
        {typing && (
          <div style={{ fontSize: 12, color: "#7f9799", fontStyle: "italic" }}>
            {typing}
          </div>
        )}
        <div ref={messagesEnd} />
      </div>

      <form className="chat-input-area" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={handleTyping}
        />
        <button type="submit">
          <FiSend />
        </button>
      </form>
    </div>
  );
}
