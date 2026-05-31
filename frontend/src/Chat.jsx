import "highlight.js/styles/atom-one-dark.css";
import { useContext, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "./Chat.css";
import { MyContext } from "./MyContext";

function Chat() {
  const { prevChats } = useContext(MyContext);
  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [prevChats]);

  return (
    <div className="chats">
      {prevChats?.map((chat, idx) => (
        <div
          key={idx}
          className={`msg-row ${chat.role === "user" ? "user" : "bot"}`}
        >
          {chat.role === "assistant" && (
            <div className="msg-avatar bot-avatar-sm">AI</div>
          )}

          <div className={`msg-bubble ${chat.role === "user" ? "user-bubble" : "bot-bubble"}`}>
            {chat.role === "user" ? (
              <p>{chat.content}</p>
            ) : (
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {chat.content}
              </ReactMarkdown>
            )}
          </div>

          {chat.role === "user" && (
            <div className="msg-avatar user-avatar-sm">
              <i className="fa-solid fa-user"></i>
            </div>
          )}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

export default Chat;
