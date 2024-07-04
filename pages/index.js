// pages/index.js
import { useState } from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { MessageSquare, Code } from "lucide-react";

const sampleCode = `
function App() {
  return (
    <div className="bg-blue-100 p-4 rounded-lg">
      <h1 className="text-2xl font-bold mb-2">Hello, Claude Playground!</h1>
      <p>This is a sample React component.</p>
    </div>
  );
}
`;

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("preview");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessages([...messages, { role: "user", content: input }]);
    // Simulated assistant response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Here's a sample React component for you to try!",
        },
      ]);
    }, 1000);
    setInput("");
  };

  return (
    <div className="flex h-screen">
      {/* Chat Interface */}
      <div className="w-1/2 p-4 border-r">
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
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-r"
          >
            Send
          </button>
        </form>
      </div>

      {/* Playground */}
      <div className="w-1/2 p-4">
        <div className="mb-4">
          <button
            onClick={() => setActiveTab("preview")}
            className={`mr-2 p-2 ${
              activeTab === "preview" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            <MessageSquare className="inline-block mr-1" /> Preview
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`p-2 ${
              activeTab === "code" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            <Code className="inline-block mr-1" /> Code
          </button>
        </div>
        <LiveProvider code={sampleCode}>
          {activeTab === "preview" ? (
            <div className="border p-4 h-[calc(100vh-8rem)] overflow-y-auto">
              <LivePreview />
              <LiveError />
            </div>
          ) : (
            <div className="border p-4 h-[calc(100vh-8rem)] overflow-y-auto">
              <LiveEditor />
            </div>
          )}
        </LiveProvider>
      </div>
    </div>
  );
}
