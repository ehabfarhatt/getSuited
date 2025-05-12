import React, { useState, useEffect } from 'react';
import { fetchCareerAdvice } from '../../services/trainingService';
import './TrainingChatbot.css';
import Navbar from '../../components/Navbar/Navbar'; // Import Navbar

const TrainingChatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ user: boolean; text: string }[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<{ name: string; profilePicture?: string } | null>(null);

  // Fetch the user data from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5001/auth/verify", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.decoded) {
            setUser({
              name: data.decoded.name,
              profilePicture: data.decoded.profilePicture,
            });
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
        });
    }
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return; // Avoid sending empty messages

    // Add user message to the chat
    setMessages([...messages, { user: true, text: input }]);
    setLoading(true);

    // Send the message to the backend for career advice
    try {
      const response = await fetchCareerAdvice(input);

      // Append AI response
      setMessages([...messages, { user: true, text: input }, { user: false, text: response }]);
    } catch (error) {
      console.error('Error fetching career advice:', error);
      setMessages([...messages, { user: true, text: input }, { user: false, text: 'Sorry, there was an error. Please try again.' }]);
    } finally {
      setInput('');
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Insert Navbar with the actual user */}
      <Navbar user={user} /> {/* This uses the actual user data */}

      {/* Messages Section */}
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.user ? 'user-message' : 'ai-message'}>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input Section */}
      <form onSubmit={handleSendMessage} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about career advice..."
          disabled={loading}
          className="input-field"
        />
        <button type="submit" disabled={loading} className="send-button">
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default TrainingChatbot;