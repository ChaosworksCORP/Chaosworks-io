import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {
  const [view, setView] = useState('email');
  const [messages, setMessages] = useState([]);
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  useEffect(() => {
    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
  }, []);

  const sendEmail = () => {
    fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: emailTo, subject: emailSubject, body: emailBody }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || data.error);
        setEmailTo('');
        setEmailSubject('');
        setEmailBody('');
      });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', background: '#0d0d0d', color: '#00ff00' }}>
      <nav>
        <button onClick={() => setView('email')}>Chaos Mail</button>
        <button onClick={() => setView('messenger')}>Live Messenger</button>
      </nav>
      {view === 'email' && (
        <div>
          <h2>Chaos Mail</h2>
          <input
            value={emailTo}
            onChange={(e) => setEmailTo(e.target.value)}
            placeholder="To"
            style={{ display: 'block', margin: '10px 0' }}
          />
          <input
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            placeholder="Subject"
            style={{ display: 'block', margin: '10px 0' }}
          />
          <textarea
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            placeholder="Message"
            style={{ display: 'block', margin: '10px 0', width: '300px', height: '100px' }}
          />
          <button onClick={sendEmail}>Send Email</button>
        </div>
      )}
      {view === 'messenger' && (
        <MessengerInterface messages={messages} socket={socket} />
      )}
    </div>
  );
}

function MessengerInterface({ messages, socket }) {
  const [input, setInput] = useState('');

  const sendMessage = () => {
    socket.emit('message', input);
    setMessages((prev) => [...prev, input]); // Add to local state for sender
    setInput('');
  };

  return (
    <div>
      <h2>Live Messenger</h2>
      <div style={{ height: '200px', overflowY: 'scroll', border: '1px solid #00ff00' }}>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message"
        style={{ margin: '10px 0' }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;