import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Avatar from "react-avatar";
import "../styles/messages.css";
import {
  getConversations,
  getConversation,
  sendMessage,
  getPetOwners,
} from "../utils/api";

export default function Messages() {
  const location = useLocation();
  const incomingUser = location.state?.user;

  // Chats state
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messagesMap, setMessagesMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search & new chat
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const conversations = await getConversations();
      
      // Convert to chat format
      const chatList = conversations.map((conv, idx) => ({
        id: conv.conversationId,
        name: conv.conversationLabel || "Unknown",
        lastMessage: conv.lastMessage || "",
        status: "offline",
      }));
      
      setChats(chatList);

      // Load messages for each conversation
      const msgMap = {};
      for (const conv of conversations) {
        try {
          const messages = await getConversation(conv.conversationId);
          msgMap[conv.conversationId] = messages.map(msg => ({
            sender: msg.sender,
            text: msg.text,
            timestamp: msg.timestamp,
          }));
        } catch (err) {
          console.error(`Failed to load messages for ${conv.conversationId}:`, err);
          msgMap[conv.conversationId] = [];
        }
      }
      setMessagesMap(msgMap);
    } catch (err) {
      setError(`Failed to load conversations: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add incoming user if not exists
  useEffect(() => {
    if (incomingUser) {
      const exists = chats.find((chat) => chat.name === incomingUser.name);
      if (!exists) {
        const newChat = {
          id: `conv_${Date.now()}`,
          name: incomingUser.name,
          lastMessage: "",
          status: "offline",
        };
        setChats((prev) => [...prev, newChat]);
      }
    }
  }, [incomingUser]);

  // Set selected chat
  useEffect(() => {
    if (incomingUser) {
      const chat = chats.find((chat) => chat.name === incomingUser.name);
      if (chat) {
        setSelectedChatId(chat.id);
      }
    } else if (chats.length > 0 && !selectedChatId) {
      setSelectedChatId(chats[0].id);
    }
  }, [incomingUser, chats, selectedChatId]);

  // Initialize messages for new chats
  useEffect(() => {
    if (selectedChatId && !messagesMap[selectedChatId]) {
      const chat = chats.find((c) => c.id === selectedChatId);
      setMessagesMap((prev) => ({
        ...prev,
        [selectedChatId]: [
          {
            sender: "owner",
            text: `Hi this is ${chat?.name || "user"}! Your pet is so adorable, is your pet available for breeding?`,
            timestamp: new Date().toISOString(),
          },
        ],
      }));
    }
  }, [selectedChatId, messagesMap, chats]);

  const [newMessage, setNewMessage] = useState("");

  const sendMessageHandler = async () => {
    if (!newMessage.trim() || !selectedChatId) return;

    const userMessage = newMessage.trim();
    const selectedChat = chats.find((c) => c.id === selectedChatId);

    try {
      // Send to backend
      const messageData = {
        conversationId: selectedChatId,
        conversationLabel: selectedChat?.name || "Unknown",
        sender: "user",
        senderName: "You",
        text: userMessage,
        timestamp: new Date().toISOString(),
      };

      await sendMessage(messageData);

      // Update local state
      setMessagesMap((prev) => {
        const prevMessages = prev[selectedChatId] || [];
        return {
          ...prev,
          [selectedChatId]: [...prevMessages, { sender: "user", text: userMessage, timestamp: messageData.timestamp }],
        };
      });

      setNewMessage("");

      // Update last message in chats list
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === selectedChatId
            ? { ...chat, lastMessage: userMessage }
            : chat
        )
      );

      // Contextual auto-reply after 1.5 seconds
      setTimeout(() => {
        let replyText = "Thanks for your message!";
        const lowerMsg = userMessage.toLowerCase();

        if (lowerMsg.includes("yes") || lowerMsg.includes("available")) {
          replyText = "Oh that's terrific! So when can we start?";
        } else if (lowerMsg.includes("no")) {
          replyText = "Oh, I see. Let me know if anything changes!";
        } else if (lowerMsg.includes("breeding")) {
          replyText = "Can you tell me more about your pet's breeding availability?";
        } else if (
          lowerMsg.includes("compliment") ||
          lowerMsg.includes("cute") ||
          lowerMsg.includes("love")
        ) {
          replyText = "Thank you! Your pet looks wonderful too!";
        } else if (
          lowerMsg.includes("add my pet on the pet listing") ||
          lowerMsg.includes("add my pet to the pet listing") ||
          lowerMsg.includes("add my pet listing")
        ) {
          replyText = "Okay noted, thank you!";
        } else if (
          lowerMsg.includes("thank you") ||
          lowerMsg.includes("thanks")
        ) {
          replyText = "You're very kind! Your pet must be amazing!";
        }

        const replyData = {
          conversationId: selectedChatId,
          conversationLabel: selectedChat?.name || "Unknown",
          sender: "owner",
          senderName: selectedChat?.name || "Owner",
          text: replyText,
          timestamp: new Date().toISOString(),
        };

        sendMessage(replyData).catch(err => console.error("Failed to send reply:", err));

        setMessagesMap((prev) => {
          const prevMessages = prev[selectedChatId] || [];
          return {
            ...prev,
            [selectedChatId]: [...prevMessages, { sender: "owner", text: replyText, timestamp: replyData.timestamp }],
          };
        });
      }, 1500);
    } catch (err) {
      setError(`Failed to send message: ${err.message}`);
      console.error(err);
    }
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const allOwners = await getPetOwners();
      const filtered = allOwners.filter((owner) =>
        `${owner.firstName} ${owner.lastName}`
          .toLowerCase()
          .includes(term.toLowerCase())
      );
      setSearchResults(filtered);
    } catch (err) {
      setError(`Failed to search users: ${err.message}`);
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const startNewChat = (owner) => {
    const conversationId = `conv_${owner.id}_${Date.now()}`;
    const newChat = {
      id: conversationId,
      name: `${owner.firstName} ${owner.lastName}`,
      lastMessage: "",
      status: "offline",
    };

    const exists = chats.find((c) => c.name === newChat.name);
    if (!exists) {
      setChats((prev) => [...prev, newChat]);
      setSelectedChatId(conversationId);
    } else {
      setSelectedChatId(chats.find((c) => c.name === newChat.name).id);
    }

    setShowSearch(false);
    setSearchTerm("");
    setSearchResults([]);
  };

  const deleteChat = (chatId) => {
    if (window.confirm('Delete this chat? This cannot be undone.')) {
      setChats((prev) => prev.filter((c) => c.id !== chatId));
      setMessagesMap((prev) => {
        const updated = { ...prev };
        delete updated[chatId];
        return updated;
      });
      if (selectedChatId === chatId) {
        setSelectedChatId(null);
      }
    }
  };

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  return (
    <div className="messages-fullscreen">
      <div className="messages-container">
        {/* Sidebar */}
        <div className="chat-sidebar">
          <div className="sidebar-header">
            <h3>Chats</h3>
            <button
              className="new-chat-btn"
              onClick={() => setShowSearch(!showSearch)}
              title="Start a new chat"
            >
              +
            </button>
          </div>

          {/* Search Box */}
          {showSearch && (
            <div className="search-box">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                autoFocus
              />
              {searching && <p className="search-status">Searching...</p>}
              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map((owner) => (
                    <div
                      key={owner.id}
                      className="search-result-item"
                      onClick={() => startNewChat(owner)}
                    >
                      <Avatar
                        name={`${owner.firstName} ${owner.lastName}`}
                        round={true}
                        size="30"
                      />
                      <span>
                        {owner.firstName} {owner.lastName}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {searchTerm && searchResults.length === 0 && !searching && (
                <p className="search-status">No users found</p>
              )}
            </div>
          )}

          {/* Chats List */}
          {chats.length === 0 && !showSearch && <p>No chats yet.</p>}
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-contact ${
                selectedChatId === chat.id ? "active" : ""
              }`}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div
                style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                onClick={() => setSelectedChatId(chat.id)}
              >
                <Avatar
                  name={chat.name}
                  round={true}
                  size="40"
                  className="contact-profile"
                />
                <div className="contact-info">
                  <p className="contact-name">{chat.name}</p>
                  <p className="contact-last">{chat.lastMessage || "No messages yet"}</p>
                </div>
                <span className={`status-dot ${chat.status}`}></span>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Window */}
        <div className="chat-window">
          {error && <div className="error-message">{error}</div>}
          <div>
            <h3>
            {selectedChat ? (
              <>
                <Avatar
                  name={selectedChat.name}
                  round={true}
                  size="50"
                  className="contact-profile"
                  style={{ marginRight: 10, verticalAlign: "middle" }}
                />
                {selectedChat.name}
              </>
            ) : (
              "Select a chat"
            )}
            </h3>
            <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(selectedChat.id);
                }}
                style={{
                  padding: '6px 10px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  marginRight: '8px',
                  display: 'flex',
                }}
                title="Delete chat"
              >
                Delete
              </button>
          </div>
          <div className="messages-area">
            {(messagesMap[selectedChatId] || []).map((msg, idx) => (
              <div
                key={idx}
                className={`chat-message ${
                  msg.sender === "user" ? "user-msg" : "owner-msg"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input-area">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessageHandler()}
              disabled={!selectedChat || loading}
            />
            <button onClick={sendMessageHandler} disabled={!selectedChat || loading}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}