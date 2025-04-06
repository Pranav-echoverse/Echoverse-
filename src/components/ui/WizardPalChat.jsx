import React, { useState } from "react";
import axios from "axios";

const messagesMock = [
  {
    sender: "harry",
    text: "Hello there! I'm Harry Potter. Ask me anything about the wizarding world!",
  },
];

export default function WizardPalChat() {
  const [messages, setMessages] = useState(messagesMock);
  const [input, setInput] = useState("");
  const [character] = useState("Harry Potter");

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "mistralai/mixtral-8x7b-instruct",
messages: [
  {
    role: "user",
    content: `You are ${character}, a student at Hogwarts. Speak as Harry Potter would. The user asks: "${input}"`
  }
],

          temperature: 0.7,
          max_tokens: 300,
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "HTTP-Referer": "http://localhost:5174",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📦 OpenRouter full response:", response.data);

      const reply =
        response.data.choices?.[0]?.message?.content?.trim() ||
        "Hmm, I seem to have lost my wand for a moment.";

      setMessages([...newMessages, { sender: "harry", text: reply }]);
    } catch (error) {
      console.error("OpenRouter Error:", error);
      setMessages([
        ...newMessages,
        {
          sender: "harry",
          text: "Oops! I had a magical mishap. Try again in a moment!",
        },
      ]);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "linear-gradient(to bottom right, #1e1b4b, #1e3a8a)",
        color: "white",
      }}
    >
      <div style={{ padding: "1.5rem", fontSize: "1.5rem", fontWeight: "bold" }}>
        🧙‍♂️ WizardPal: Chat with {character}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              maxWidth: "70%",
              marginLeft: msg.sender === "user" ? "auto" : 0,
              background: msg.sender === "user" ? "white" : "#fef3c7",
              color: "black",
              borderRadius: "0.5rem",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          padding: "1.5rem",
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(5px)",
        }}
      >
        <input
          type="text"
          placeholder={`Ask ${character} something magical...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          style={{
            flex: 1,
            padding: "0.75rem",
            borderRadius: "0.5rem",
            border: "none",
            color: "black",
          }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "0.5rem",
            background: "white",
            color: "black",
            border: "none",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
