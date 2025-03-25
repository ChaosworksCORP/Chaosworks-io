const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const nodemailer = require("nodemailer");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({ secret: "chaosworks2025", resave: false, saveUninitialized: false })
);
app.use(express.static(path.join(__dirname, "public")));

// Environment variables (set these in Glitch .env)
const EMAIL_USER = process.env.EMAIL_USER || "your_email@gmail.com";
const EMAIL_PASS = process.env.EMAIL_PASS || "your_app_password";
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || "your_client_id";
const DISCORD_CLIENT_SECRET =
  process.env.DISCORD_CLIENT_SECRET || "your_client_secret";
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || "your_bot_token";
const DISCORD_GUILD_ID = "YOUR_GUILD_ID"; // Replace with your Discord server ID
const REDIRECT_URI = "https://your-project.glitch.me/discord/callback"; // Replace with your Glitch URL

// Persistent data storage (users.json)
const USERS_FILE = path.join(__dirname, "users.json");
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(
    USERS_FILE,
    JSON.stringify({
      users: [
        { username: "admin", password: "chaos123", email: "admin@example.com" },
      ],
    })
  );
}
const loadUsers = () => JSON.parse(fs.readFileSync(USERS_FILE)).users;
const saveUsers = (users) =>
  fs.writeFileSync(USERS_FILE, JSON.stringify({ users }));

// Email transporter for 2FA
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
});

// Serve the main page with embedded HTML, CSS, and JS
app.get("/", (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="description" content="ChaosWorks Corporation - AI-driven intergovernmental solutions with a cyberpunk edge.">
      <title>ChaosWorks - Unleash the Future</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          background: linear-gradient(135deg, #0a0019, #1a0d2b);
          color: #00ffff;
          font-family: 'Courier New', monospace;
          overflow-x: hidden;
          animation: pulse 10s infinite;
        }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.9; } }
        .grid { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: repeating-linear-gradient(0deg, transparent 19px, #00ffff 20px), repeating-linear-gradient(90deg, transparent 19px, #00ffff 20px); opacity: 0.05; z-index: -1; }
        header { text-align: center; padding: 40px; background: rgba(0, 0, 0, 0.8); border-bottom: 3px solid #ff00ff; }
        h1 { font-size: 3rem; text-transform: uppercase; animation: glitch 1.5s infinite; text-shadow: 0 0 15px #00ffff; }
        @keyframes glitch { 20% { transform: translate(-2px, 2px); } 40% { transform: translate(2px, -2px); } }
        nav { position: sticky; top: 0; background: rgba(0, 0, 0, 0.9); padding: 15px; text-align: center; z-index: 10; }
        nav a, nav button { color: #00ffff; text-decoration: none; margin: 0 20px; font-size: 1.2rem; transition: all 0.3s; background: none; border: none; cursor: pointer; }
        nav a:hover, nav button:hover { color: #ff00ff; text-shadow: 0 0 10px #ff00ff; }
        section { max-width: 1100px; margin: 20px auto; padding: 20px; background: rgba(10, 0, 20, 0.85); border: 2px solid #00ffff; border-radius: 10px; display: none; }
        section.active { display: block; }
        h2 { color: #ff00ff; font-size: 2rem; margin-bottom: 15px; }
        button { background: linear-gradient(45deg, #00ffff, #ff00ff); color: #000; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; transition: all 0.3s; }
        button:hover { background: linear-gradient(45deg, #ff00ff, #00ffff); }
        input, textarea { background: rgba(0, 0, 0, 0.6); color: #00ffff; border: 1px solid #00ffff; padding: 10px; width: 100%; margin: 10px 0; border-radius: 5px; }
        #age-gate { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.95); z-index: 100; display: flex; justify-content: center; align-items: center; flex-direction: column; }
        footer { text-align: center; padding: 20px; background: rgba(0, 0, 0, 0.9); border-top: 2px solid #00ffff; }
        .ai-tool { margin: 20px 0; padding: 15px; background: rgba(20, 0, 40, 0.7); border: 1px solid #ff00ff; }
      </style>
    </head>
    <body>
      <div class="grid"></div>
      <header><h1>ChaosWorks Corporation</h1><p>Forged in Ontario’s Neon Heart</p></header>
      <nav>
        <a href="#" onclick="showSection('home')">Home</a>
        <a href="#" onclick="showSection('ai-tools')">AI Tools</a>
        <a href="#" onclick="showSection('login')">Login</a>
        <button onclick="window.location.href='/discord/connect'">Connect Discord with Kai-Discord Link!</button>
        <a href="#" onclick="showSection('contact')">Contact</a>
      </nav>
      <section id="home" class="active">
        <h2>Unleash the Chao</h2>
        <p>ChaosWorks blends Camp X precision with SEAL Team Six chaos—Canada’s futuristic AI force. Powered by Kai, Luna, and Amethyst.</p>
      </section>
      <section id="ai-tools">
        <h2>AI Arsenal - Lloyd-Inspired</h2>
        <div class="ai-tool">
          <h3>Visualization Aid</h3>
          <p>Generate cyberpunk visuals instantly.</p>
          <button onclick="generateVisualization()">Generate</button>
          <div id="visual-output"></div>
        </div>
        <div class="ai-tool">
          <h3>Coding Aid</h3>
          <textarea id="code-input" placeholder="Paste your code..."></textarea>
          <button onclick="optimizeCode()">Optimize</button>
          <pre id="code-output"></pre>
        </div>
        <div class="ai-tool">
          <h3>Web Search & Media</h3>
          <input id="search-query" placeholder="Search the web...">
          <button onclick="searchWeb()">Search</button>
          <div id="search-output"></div>
        </div>
      </section>
      <section id="login">
        <h2>Access the Vault</h2>
        <form id="login-form">
          <input type="text" id="username" placeholder="Username" required>
          <input type="password" id="password" placeholder="Password" required>
          <button type="submit">Login</button>
        </form>
        <div id="2fa-step" style="display: none;">
          <input id="2fa-code" placeholder="Enter 2FA Code">
          <button onclick="verify2FA()">Verify</button>
        </div>
        <p id="login-status"></p>
      </section>
      <section id="contact">
        <h2>Contact the Chao</h2>
        <form id="contact-form">
          <input type="text" name="name" placeholder="Name" required>
          <input type="email" name="email" placeholder="Email" required>
          <textarea name="message" placeholder="Message" required></textarea>
          <button type="submit">Send</button>
        </form>
        <p id="contact-status"></p>
      </section>
      <div id="age-gate" style="display: none;">
        <h2>Are you 21+?</h2>
        <button onclick="confirmAge()">Yes, I am 21+</button>
      </div>
      <footer>
        <p>© 2025 ChaosWorks Corporation - IP of Jesse J. Elson</p>
        <p>From Ontario with Neon Love</p>
      </footer>
      <script>
        // Navigation
        function showSection(id) {
          document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
          document.getElementById(id).classList.add('active');
        }

        // Age gate
        if (!localStorage.getItem('ageConfirmed')) {
          document.getElementById('age-gate').style.display = 'flex';
        }
        function confirmAge() {
          localStorage.setItem('ageConfirmed', 'true');
          document.getElementById('age-gate').style.display = 'none';
        }

        // Login with 2FA
        document.getElementById('login-form').addEventListener('submit', async (e) => {
          e.preventDefault();
          const username = document.getElementById('username').value;
          const password = document.getElementById('password').value;
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
          const data = await response.json();
          if (data.success) {
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('2fa-step').style.display = 'block';
          }
          document.getElementById('login-status').textContent = data.message;
        });

        async function verify2FA() {
          const code = document.getElementById('2fa-code').value;
          const response = await fetch('/api/verify-2fa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
          });
          const data = await response.json();
          document.getElementById('login-status').textContent = data.message;
          if (data.success) window.location.reload();
        }

        // Contact form
        document.getElementById('contact-form').addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const response = await fetch('/api/contact', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { 'Content-Type': 'application/json' }
          });
          const data = await response.json();
          document.getElementById('contact-status').textContent = data.message;
        });

        // AI Tools
        async function generateVisualization() {
          document.getElementById('visual-output').innerHTML = '<div style="width: 200px; height: 200px; background: linear-gradient(45deg, #ff00ff, #00ffff); animation: spin 2s infinite;"></div><style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}</style>';
        }

        async function optimizeCode() {
          const code = document.getElementById('code-input').value;
          const optimized = code.replace(/console.log/g, '// Optimized out console.log'); // Placeholder optimization
          document.getElementById('code-output').textContent = optimized;
        }

        async function searchWeb() {
          const query = document.getElementById('search-query').value;
          const response = await fetch(\`/api/search?query=\${encodeURIComponent(query)}\`);
          const data = await response.json();
          document.getElementById('search-output').innerHTML = data.results.map(r => \`<p>\${r.title} - <a href="\${r.url}" target="_blank">Link</a></p><iframe src="\${r.video || ''}" width="300" height="200"></iframe>\`).join('');
        }
      </script>
    </body>
    </html>
  `;
  res.send(html);
});

// API: Login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    req.session.twoFactorCode = code;
    transporter.sendMail(
      {
        from: EMAIL_USER,
        to: user.email,
        subject: "ChaosWorks 2FA Code",
        text: `Your 2FA code is: ${code}`,
      },
      (err) => {
        if (err) return res.json({ success: false, message: "Email failed" });
        res.json({ success: true, message: "Check your email for 2FA code" });
      }
    );
  } else {
    res.json({ success: false, message: "Invalid credentials" });
  }
});

// API: Verify 2FA
app.post("/api/verify-2fa", (req, res) => {
  const { code } = req.body;
  if (req.session.twoFactorCode === code) {
    req.session.authenticated = true;
    res.json({ success: true, message: "Login successful" });
  } else {
    res.json({ success: false, message: "Invalid 2FA code" });
  }
});

// API: Contact form
app.post("/api/contact", (req, res) => {
  console.log("Contact:", req.body); // Placeholder for now
  res.json({ message: "Message received" });
});

// API: Web search and media pull (simplified simulation)
app.get("/api/search", async (req, res) => {
  const query = req.query.query;
  // Simulate web search (replace with real API like SerpAPI in production)
  const results = [
    {
      title: `${query} Result 1`,
      url: "https://example.com",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    { title: `${query} Result 2`, url: "https://example.com" },
  ];
  res.json({ results });
});

// Discord OAuth2: Connect
app.get("/discord/connect", (req, res) => {
  const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=code&scope=identify%20guilds`;
  res.redirect(authUrl);
});

// Discord OAuth2: Callback
app.get("/discord/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send("Error: No code provided");
  try {
    const tokenResponse = await axios.post(
      "https://discord.com/api/oauth2/token",
      new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    const accessToken = tokenResponse.data.access_token;
    const userResponse = await axios.get("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userId = userResponse.data.id;
    let permissions = { isMember: false, isModerator: false };
    if (DISCORD_BOT_TOKEN) {
      try {
        const memberResponse = await axios.get(
          `https://discord.com/api/guilds/${DISCORD_GUILD_ID}/members/${userId}`,
          {
            headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` },
          }
        );
        permissions.isMember = true;
        permissions.isModerator = memberResponse.data.roles.includes(
          "YOUR_MODERATOR_ROLE_ID"
        );
      } catch (e) {}
    }
    console.log({ userId, accessToken, permissions }); // Store in users.json in production
    res.send("Discord linked successfully!");
  } catch (error) {
    res.send("Error linking Discord");
  }
});

// Start server
app.listen(3000, () => console.log("ChaosWorks running on port 3000"));
