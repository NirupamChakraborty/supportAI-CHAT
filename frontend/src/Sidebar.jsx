import { useContext, useEffect } from "react";
import { v1 as uuidv1 } from "uuid";
import { MyContext } from "./MyContext.jsx";
import "./Sidebar.css";

function Sidebar() {
  const {
    allThreads, setAllThreads,
    currThreadId, setCurrThreadId,
    setNewChat, setPrompt, setReply, setPrevChats,
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/thread`);
      if (!response.ok) return;
      const res = await response.json();
      if (!Array.isArray(res)) return;
      setAllThreads(res.map((t) => ({ threadId: t.threadId, title: t.title })));
    } catch (err) {
      console.error("getAllThreads error:", err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/thread/${newThreadId}`);
      if (!response.ok) return;
      const res = await response.json();
      if (!Array.isArray(res)) return;
      setPrevChats(res);
      setNewChat(false);
    } catch (err) {
      console.error("changeThread error:", err);
    }
  };

  const deleteThread = async (e, threadId) => {
    e.stopPropagation();
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/thread/${threadId}`, { method: "DELETE" });
      setAllThreads((prev) => prev.filter((t) => t.threadId !== threadId));
      if (threadId === currThreadId) createNewChat();
    } catch (err) {
      console.error("deleteThread error:", err);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand">
          <div className="brand-icon">
            {/* SVG bot logo — change color via --accent in App.css */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="8" width="18" height="13" rx="3" stroke="#7ec8f0" strokeWidth="1.8"/>
              <circle cx="9" cy="14" r="1.5" fill="#7ec8f0"/>
              <circle cx="15" cy="14" r="1.5" fill="#7ec8f0"/>
              <path d="M12 3v5M9.5 8h5" stroke="#7ec8f0" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="12" cy="3" r="1.2" fill="#7ec8f0"/>
            </svg>
          </div>
          <div>
            <div className="brand-name">SupportAI</div>
            <div className="brand-sub">Help Center</div>
          </div>
        </div>
        <button className="new-chat-btn" onClick={createNewChat}>
          <i className="fa-solid fa-plus"></i>
          New conversation
          <i className="fa-solid fa-pen-to-square"></i>
        </button>
      </div>

      {allThreads.length > 0 && (
        <div className="section-label">Recent</div>
      )}

      <ul className="thread-list">
        {allThreads?.map((thread, idx) => (
          <li
            key={idx}
            className={`thread-item ${thread.threadId === currThreadId ? "active" : ""}`}
            onClick={() => changeThread(thread.threadId)}
          >
            <div className="thread-left">
              <i className="fa-regular fa-message"></i>
              <span className="thread-title">{thread.title}</span>
            </div>
            <i
              className="fa-solid fa-trash thread-del"
              onClick={(e) => deleteThread(e, thread.threadId)}
            ></i>
          </li>
        ))}
      </ul>

      {/* Footer: just a subtle powered-by line, no user/settings */}
      <div className="sidebar-footer">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="8" width="18" height="13" rx="3" stroke="#4d6680" strokeWidth="1.8"/>
          <circle cx="9" cy="14" r="1.5" fill="#4d6680"/>
          <circle cx="15" cy="14" r="1.5" fill="#4d6680"/>
          <path d="M12 3v5M9.5 8h5" stroke="#4d6680" strokeWidth="1.8" strokeLinecap="round"/>
          <circle cx="12" cy="3" r="1.2" fill="#4d6680"/>
        </svg>
        <span className="footer-tagline">Powered by SupportAI</span>
      </div>
    </aside>
  );
}

export default Sidebar;
