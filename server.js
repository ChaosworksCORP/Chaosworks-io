const http = require('http');
const fs = require('fs');
const url = require('url');

// Create server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const query = parsedUrl.query;

  // Helper: Send JSON response
  const sendJson = (status, data) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  // Serve front-end
  if (path === '/' || path === '') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ChaosWorks - No NPM Edition</title>
        <style>
          body { background: #0a0019; color: #00ffff; font-family: monospace; }
          h1 { text-shadow: 0 0 10px #ff00ff; animation: glitch 1.5s infinite; }
          @keyframes glitch { 20% { transform: translate(-2px, 2px); } 40% { transform: translate(2px, -2px); } }
          button { background: #00ffff; color: #000; padding: 10px; border: none; cursor: pointer; }
          button:hover { background: #ff00ff; }
          input, textarea { background: #000; color: #00ffff; border: 1px solid #00ffff; padding: 5px; }
        </style>
      </head>
      <body>
        <h1>ChaosWorks Corporation</h1>
        <p>Login or use Chaos Tools below.</p>
        <div>
          <h2>Login</h2>
          <input id="username" placeholder="Username">
          <input id="password" type="password" placeholder="Password">
          <button onclick="login()">Login</button>
          <p id="login-status"></p>
        </div>
        <div>
          <h2>Send Chaos Mail</h2>
          <input id="email-to" placeholder="To">
          <input id="email-subject" placeholder="Subject">
          <textarea id="email-body" placeholder="Body"></textarea>
          <button onclick="sendEmail()">Send</button>
          <p id="email-status"></p>
        </div>
        <div>
          <h2>Live Messenger</h2>
          <div id="messages"></div>
          <input id="msg-input" placeholder="Type a message">
          <button onclick="sendMessage()">Send</button>
        </div>
        <div>
          <h2>Web Fetch</h2>
          <input id="fetch-url" placeholder="Enter URL">
          <button onclick="fetchUrl()">Fetch</button>
          <div id="fetch-output"></div>
        </div>
        <script>
          async function login() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const res = await fetch('/api/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            document.getElementById('login-status').textContent = data.message;
          }

          async function sendEmail() {
            const to = document.getElementById('email-to').value;
            const subject = document.getElementById('email-subject').value;
            const body = document.getElementById('email-body').value;
            const res = await fetch('/api/send-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ to, subject, body })
            });
            const data = await res.json();
            document.getElementById('email-status').textContent = data.message;
          }

          let messages = [];
          async function sendMessage() {
            const msg = document.getElementById('msg-input').value;
            messages.push(msg);
            document.getElementById('messages').innerHTML = messages.map(m => '<p>' + m + '</p>').join('');
            document.getElementById('msg-input').value = '';
            // Simulate broadcast (no Socket.IO)
            fetch('/api/message', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: msg })
            });
          }

          async function fetchUrl() {
            const url = document.getElementById('fetch-url').value;
            const res = await fetch('/api/fetch?url=' + encodeURIComponent(url));
            const data = await res.json();
            document.getElementById('fetch-output').innerHTML = data.data || 'Error fetching URL';
          }
        </script>
      </body>
      </html>
    `);
  }

  // API: Login (simplified, no JWT or MongoDB)
  else if (path === '/api/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { username, password } = JSON.parse(body);
      // Hardcoded for simplicity (no database)
      if (username === 'admin' && password === 'chaos123') {
        sendJson(200, { message: 'Login successful' });
      } else {
        sendJson(401, { message: 'Invalid credentials' });
      }
    });
  }

  // API: Send Email (simulated, no Nodemailer)
  else if (path === '/api/send-email' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { to, subject, body: emailBody } = JSON.parse(body);
      console.log(`Email sent to ${to}: ${subject} - ${emailBody}`); // Simulation
      sendJson(200, { message: 'Email sent (simulated)' });
    });
  }

  // API: Messenger (simulated, no Socket.IO)
  else if (path === '/api/message' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { message } = JSON.parse(body);
      console.log('Message broadcast:', message); // Simulation
      sendJson(200, { message: 'Message received' });
    });
  }

  // API: Fetch/Webpull (basic HTTP request)
  else if (path === '/api/fetch') {
    const fetchUrl = query.url;
    if (!fetchUrl) return sendJson(400, { message: 'URL required' });
    http.get(fetchUrl, (fetchRes) => {
      let data = '';
      fetchRes.on('data', chunk => data += chunk);
      fetchRes.on('end', () => sendJson(200, { data }));
    }).on('error', (e) => sendJson(500, { message: 'Fetch failed: ' + e.message }));
  }

  // 404
  else {
    sendJson(404, { message: 'Not found' });
  }
});

// Keep-alive (simulated, no external service)
setInterval(() => {
  http.get(`http://localhost:${PORT}`, (res) => {
    console.log('Self-ping to stay alive');
  }).on('error', () => {});
}, 15 * 60 * 1000); // Every 15 minutes

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`ChaosWorks running on port ${PORT}`));