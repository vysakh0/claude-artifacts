// pages/index.js
import { useState } from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { MessageSquare, Code } from "lucide-react";

const initialCode = `
function App() {
  return (
    <div style={{
      backgroundColor: '#f0f0f0',
      padding: '20px',
      borderRadius: '8px',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h1 style={{
        color: '#333',
        fontSize: '24px',
      }}>Welcome to Claude Playground!</h1>
      <p style={{
        color: '#666',
        fontSize: '16px',
      }}>This is a sample React component. Send a message to generate a new one!</p>
    </div>
  );
}
`;

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("preview");
  const [code, setCode] = useState(initialCode);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.chatResponse },
      ]);
      setCode(data.playgroundData);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, but I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Chat Interface */}
      <div className="w-1/2 p-4 border-r bg-white">
        <div className="h-[calc(100vh-8rem)] overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 ${
                msg.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-2 border rounded-l"
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-r"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>

      {/* Playground */}
      <div className="w-1/2 p-4">
        <div className="mb-4">
          <button
            onClick={() => setActiveTab("preview")}
            className={`mr-2 p-2 rounded ${
              activeTab === "preview" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            <MessageSquare className="inline-block mr-1" /> Preview
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`p-2 rounded ${
              activeTab === "code" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            <Code className="inline-block mr-1" /> Code
          </button>
        </div>
        <LiveProvider code={code}>
          {activeTab === "preview" ? (
            <div className="border p-4 h-[calc(100vh-8rem)] overflow-y-auto bg-white rounded">
              <LivePreview />
              <LiveError />
            </div>
          ) : (
            <div className="border p-4 h-[calc(100vh-8rem)] overflow-y-auto bg-white rounded">
              <LiveEditor />
            </div>
          )}
        </LiveProvider>
      </div>
    </div>
  );
}
