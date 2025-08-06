import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = { sender: "You", text: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });
      

      const data = await res.json();
      const sherlockReply = { sender: "Sherlock", text: data.reply };
      setMessages((prev) => [...prev, sherlockReply]);
    } catch (err) {
      console.error("Error:", err);
    }

    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="container">
      <h1 className="title">🕵️ SherBot</h1>

      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender === "You" ? "user" : "sherlock"}`}>
            <strong>{msg.sender}: </strong> {msg.text}
          </div>
        ))}
        {isLoading && <div className="loading">Sherlock is thinking...</div>}
        <div ref={chatEndRef} />
      </div>

      <div className="input-area">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Sherlock anything..."
          rows={2}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
