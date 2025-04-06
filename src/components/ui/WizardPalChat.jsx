import React, { useState } from 'react';
import axios from 'axios';

export default function WizardPalChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'harry', text: "Hello there! I'm Harry Potter. Ask me anything about the wizarding world!" }
  ]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setInput('');
    console.log("🔑 Loaded API Key:", import.meta.env.VITE_OPENROUTER_API_KEY);
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'mistralai/mixtral-8x7b-instruct',
          messages: [
            { role: 'system', content: 'You are Harry Potter, speaking in character. Be witty, kind, and knowledgeable about the wizarding world.' },
            { role: 'user', content: input }
          ],
          temperature: 0.7,
          max_tokens: 300,
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const reply =
        response.data.choices?.[0]?.message?.content?.trim() ||
        "Hmm, I seem to have lost my wand for a moment.";

      setMessages([...newMessages, { sender: 'harry', text: reply }]);
    } catch (error) {
      console.error('OpenRouter Error:', error);
      setMessages([...newMessages, { sender: 'harry', text: 'Oops! I had a magical mishap. Try again in a moment!' }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="chat-container">
      <h1>🧙‍♂️ WizardPal: Chat with Harry Potter</h1>
      {messages.map((msg, i) => (
        <div key={i} className={`message ${msg.sender}`}>
          {msg.text}
        </div>
      ))}
      <input
        type="text"
        placeholder="Ask Harry Potter something magical..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      />
    </div>
  );
  
}
