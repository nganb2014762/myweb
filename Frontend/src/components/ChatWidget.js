import React, { useState } from "react";
import axios from "axios";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post("http://localhost:5000/api/chatbot", {
        message: input,
      });
      const botMessage = { role: "bot", content: response.data.botMessage };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error communicating with chatbot:", error);
    }

    setInput("");
  };

  const styles = {
    chatWidget: {
      position: "fixed",
      bottom: "120px",
      right: "20px",
      width: "350px",
      maxWidth: "90%",
      borderRadius: "10px",
      transition: "all 0.3s ease-in-out",
      overflow: "hidden",
      transform: isOpen ? "translateY(0)" : "translateY(100%)",
    },
    chatToggle: {
      bottom: "100px",
      right: "10px",
      width: "60px",
      height: "60px",
      marginLeft: "270px",
      backgroundColor: "#007bff",
      color: "white",
      borderRadius: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      fontSize: "24px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
    },
    chatbox: {
      display: "flex",
      flexDirection: "column",
      height: "400px",
    },
    chatHeader: {
      backgroundColor: "#0099FF",
      color: "white",
      padding: "10px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    chatContent: {
      flex: 1,
      overflowY: "auto",
      padding: "10px",
      backgroundColor: "#f9f9f9",
    },
    message: {
      margin: "5px 0",
      padding: "10px",
      borderRadius: "5px",
      maxWidth: "70%",
      display: "inline-block",
      clear: "both",
    },
    messageUser: {
      backgroundColor: "#0099FF",
      color: "white",
      float: "right",
      textAlign: "right",
    },
    messageBot: {
      backgroundColor: "#ddd",
      color: "black",
      float: "left",
      textAlign: "left",
    },
    chatInput: {
      display: "flex",
      padding: "10px",
      backgroundColor: "#ddd",
    },
    inputField: {
      flex: 1,
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #ccc",
    },
    sendButton: {
      marginLeft: "10px",
      padding: "10px",
      backgroundColor: "#0099FF",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.chatWidget}>
      {!isOpen && (
        <div style={styles.chatToggle} onClick={() => setIsOpen(true)}>
          💬
        </div>
      )}
      {isOpen && (
        <div style={styles.chatbox}>
          <div style={styles.chatHeader}>
            <span>Chatbot</span>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                backgroundColor: "transparent", // nền trong suốt
                color: "#f1f1f1", 
                border: "none",
                fontSize: "20px", 
                cursor: "pointer", 
              }}
            >
              X
            </button>
          </div>
          <div style={styles.chatContent}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  ...styles.message,
                  ...(msg.role === "user"
                    ? styles.messageUser
                    : styles.messageBot),
                }}
              >
                {msg.content}
              </div>
            ))}
          </div>
          <div style={styles.chatInput}>
            <input
              style={styles.inputField}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
            />
            <button style={styles.sendButton} onClick={sendMessage}>
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
