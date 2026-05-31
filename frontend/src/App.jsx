import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { v1 as uuidv1 } from "uuid";
import "./App.css";
import ChatWindow from "./ChatWindow.jsx";
import LandingPage from "./LandingPage.jsx";
import { MyContext } from "./MyContext.jsx";
import Sidebar from "./Sidebar.jsx";

function ChatApp() {
  const [prompt, setPrompt] = useState("");
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  return (
    <MyContext.Provider value={{
      prompt, setPrompt,
      currThreadId, setCurrThreadId,
      newChat, setNewChat,
      prevChats, setPrevChats,
      allThreads, setAllThreads,
    }}>
      <div className="app">
        <Sidebar />
        <ChatWindow />
      </div>
    </MyContext.Provider>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chat" element={<ChatApp />} />
    </Routes>
  );
}
