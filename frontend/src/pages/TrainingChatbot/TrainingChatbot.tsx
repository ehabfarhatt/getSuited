import React, { useState } from 'react';
import { fetchCareerAdvice } from '../../services/trainingService'; // Add this service method

const TrainingChatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ user: boolean; text: string }[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

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
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.user ? 'user-message' : 'ai-message'}>
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about career advice..."
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default TrainingChatbot;