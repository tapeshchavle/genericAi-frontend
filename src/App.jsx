import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('https://genericai-gpaqh0dagdfmdkej.centralindia-01.azurewebsites.net/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.text();
      setMessages(prev => [...prev, { role: 'assistant', content: data }]);
    } catch (error) {
      console.error('Error fetching chat response:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error communicating with the server.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>GenericAI</h1>
      </header>

      <main className="chat-container">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <h2>How can I help you today?</h2>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message, index) => (
              <div key={index} className={`message-wrapper ${message.role}`}>
                <div className="message-content">
                  <div className="avatar">{message.role === 'user' ? 'U' : 'AI'}</div>
                  <div className="text">{message.content}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message-wrapper assistant">
                <div className="message-content">
                  <div className="avatar">AI</div>
                  <div className="text loading-dots">thinking...</div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <footer className="input-container">
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message GenericAI..."
            disabled={isLoading}
          />
          <button type="submit" disabled={!input.trim() || isLoading}>
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}

export default App;
