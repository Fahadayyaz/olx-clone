import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ChatWindow from "../components/ChatWindow";
import { format } from "timeago.js";

export default function ChatPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/chats")
      .then((res) => {
        setChats(res.data);
        // Auto-select from navigation state
        if (location.state?.activeChatId) {
          const found = res.data.find(
            (c) => c._id === location.state.activeChatId,
          );
          if (found) setActiveChat(found);
        }
      })
      .finally(() => setLoading(false));
  }, [location.state]);

  if (loading) return <div className="spinner" />;

  return (
    <div className="chat-page">
      <div className="chat-list">
        <div className="chat-list-header">Chats</div>
        {chats.length === 0 ? (
          <div style={{ padding: 24, color: "#7f9799", textAlign: "center" }}>
            No chats yet
          </div>
        ) : (
          chats.map((chat) => {
            const other = chat.participants?.find((p) => p._id !== user._id);
            return (
              <div
                key={chat._id}
                className={`chat-item ${activeChat?._id === chat._id ? "active" : ""}`}
                onClick={() => setActiveChat(chat)}
              >
                <img
                  src={
                    other?.avatar ||
                    `https://ui-avatars.com/api/?name=${other?.name}&background=23e5db&color=002f34`
                  }
                  alt=""
                />
                <div className="chat-item-info">
                  <div className="chat-item-name">{other?.name}</div>
                  <div style={{ fontSize: 12, color: "#7f9799" }}>
                    {chat.ad?.title}
                  </div>
                  <div className="chat-item-last">
                    {chat.lastMessage?.text || "No messages yet"}
                    {chat.lastMessage?.createdAt && (
                      <span style={{ float: "right", fontSize: 11 }}>
                        {format(chat.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <ChatWindow chat={activeChat} />
    </div>
  );
}
