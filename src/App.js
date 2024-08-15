import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import './App.css'; // Import the CSS file

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

function App() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [celebrityName, setCelebrityName] = useState('');
  const [customCelebrityName, setCustomCelebrityName] = useState('');
  const [sessionId, setSessionId] = useState(''); // Session ID will be generated dynamically
  const [isChatStarted, setIsChatStarted] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Add user's message to the chat history
    setChatHistory([...chatHistory, { role: 'user', content: message }]);

    try {
      const selectedCelebrityName = celebrityName === 'custom' ? customCelebrityName : celebrityName;

      const response = await axios.post(`${apiBaseUrl}/chat`, {
        message,
        sessionId,
        celebrityName: selectedCelebrityName
      });

      // Add the AI's response to the chat history
      setChatHistory([...chatHistory, { role: 'user', content: message }, { role: 'assistant', content: response.data.reply }]);
    } catch (error) {
      console.error('Error sending message:', error);
    }

    // Clear the message input
    setMessage('');
  };

  const handleStartChat = () => {
    setIsChatStarted(true);
    setChatHistory([]);
    setSessionId(uuidv4()); // Generate a unique session ID
  };

  const handleResetSession = () => {
    // Reset all states to start a new session
    setMessage('');
    setChatHistory([]);
    setCelebrityName('');
    setCustomCelebrityName('');
    setSessionId(''); // Clear the session ID
    setIsChatStarted(false); // Go back to the selection screen
  };

  return (
    <div className="container">
      {!isChatStarted ? (
        <div>
          <h1>Select or Type a Celebrity to Chat With</h1>
          <select 
            value={celebrityName} 
            onChange={(e) => setCelebrityName(e.target.value)} 
          >
            <option value="">Select a Celebrity</option>
            <option value="Leonardo DiCaprio">Leonardo DiCaprio</option>
            <option value="Scarlett Johansson">Scarlett Johansson</option>
            <option value="Tom Hanks">Tom Hanks</option>
            <option value="Emma Watson">Emma Watson</option>
            <option value="Dwayne Johnson">Dwayne Johnson</option>
            <option value="Taylor Swift">Taylor Swift</option>
            <option value="Chris Hemsworth">Chris Hemsworth</option>
            <option value="Ariana Grande">Ariana Grande</option>
            <option value="custom">Custom Celebrity</option>
          </select>
          {celebrityName === 'custom' && (
            <div>
              <input
                type="text"
                value={customCelebrityName}
                onChange={(e) => setCustomCelebrityName(e.target.value)}
                placeholder="Type the celebrity name..."
              />
            </div>
          )}
          <button onClick={handleStartChat}>
            Start Chat
          </button>
        </div>
      ) : (
        <div>
          <h1>Chat with {celebrityName === 'custom' ? customCelebrityName : celebrityName}</h1>
          <div className="chat-box">
            {chatHistory.map((chat, index) => (
              <div key={index} className="chat-message">
                <strong>{chat.role === 'user' ? 'You' : (celebrityName === 'custom' ? customCelebrityName : celebrityName)}:</strong> {chat.content}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
          />
          <button onClick={handleSendMessage}>
            Send
          </button>
          <button onClick={handleResetSession} style={{ backgroundColor: 'red', marginTop: '10px' }}>
            Reset Session
          </button>
        </div>
      )}
    </div>
  );
}

export default App;