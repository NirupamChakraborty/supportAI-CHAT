import { useContext, useEffect, useRef, useState } from "react";
import Chat from "./Chat.jsx";
import "./ChatWindow.css";
import { MyContext } from "./MyContext.jsx";

const QUICK_CHIPS = [
  "Reset my password",
  "Billing issue",
  "Technical help",
  "Talk to a human",
];

function ChatWindow() {
  const {
    prompt, setPrompt,
    reply, setReply,
    currThreadId,
    setPrevChats, setNewChat,
    newChat, prevChats,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);

  const getReply = async (overridePrompt) => {
    const message = (overridePrompt ?? prompt).trim();
    if (!message || loading) return;

    setLoading(true);
    setNewChat(false);
    setError(null);

    // Optimistically add user message to UI immediately
    setPrevChats((prev) => [...prev, { role: "user", content: message }]);
    setPrompt("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/api/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: message, threadId: currThreadId }),
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const res = await response.json();
      const botReply = res.reply || "Sorry, I couldn't get a response.";
      setPrevChats((prev) => [...prev, { role: "assistant", content: botReply }]);
    } catch (err) {
      console.error("getReply error:", err);
      setError("Couldn't reach the server. Please check your backend is running.");
      setPrevChats((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Sorry, I couldn't connect to the server. Please try again." },
      ]);
    }

    setLoading(false);
  };

  // Removed the reply useEffect - we now set prevChats directly in getReply
  // so there's no double-append risk

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      getReply();
    }
  };

  const handleInput = (e) => {
    setPrompt(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const showWelcome = newChat && prevChats.length === 0;

  return (
    <div className="chat-window">
      {/* Topbar */}
      <div className="chat-topbar">
        <div className="topbar-left">
          <div className="status-dot"></div>
          <div>
            <div className="topbar-title">Support Assistant</div>
            <div className="topbar-sub">Typically replies in seconds</div>
          </div>
        </div>
        <div className="topbar-badge">
          <span className="badge-dot"></span>
          Online
        </div>
      </div>

      {/* Messages */}
      <div className="chat-body">
        {showWelcome ? (
          <div className="welcome-wrap">
            <div className="welcome-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="8" width="18" height="13" rx="3" stroke="#7ec8f0" strokeWidth="1.6"/>
                <circle cx="9" cy="14" r="1.5" fill="#7ec8f0"/>
                <circle cx="15" cy="14" r="1.5" fill="#7ec8f0"/>
                <path d="M12 3v5M9.5 8h5" stroke="#7ec8f0" strokeWidth="1.6" strokeLinecap="round"/>
                <circle cx="12" cy="3" r="1.2" fill="#7ec8f0"/>
              </svg>
            </div>
            <h2 className="welcome-title">How can we help?</h2>
            <p className="welcome-sub">
              Ask anything — billing, accounts, technical issues, or general support.
            </p>
            <div className="quick-chips">
              {QUICK_CHIPS.map((chip) => (
                <button
                  key={chip}
                  className="chip"
                  onClick={() => getReply(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <Chat />
            {loading && (
              <div className="typing-row">
                <div className="bot-avatar">AI</div>
                <div className="typing-bubble">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Input */}
      <div className="chat-input-area">
        {error && <p className="error-banner">{error}</p>}
        <div className="input-box">
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="Type your message…"
            value={prompt}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
          />
          <button
            className="send-btn"
            onClick={() => getReply()}
            disabled={!prompt.trim() || loading}
            title="Send"
          >
            {loading
              ? <i className="fa-solid fa-circle-notch fa-spin"></i>
              : <i className="fa-solid fa-paper-plane"></i>
            }
          </button>
        </div>
        <p className="input-hint">
          Support AI may make mistakes. For urgent issues, email{" "}
          <a href="mailto:support@yourapp.com">support@yourapp.com</a>
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
