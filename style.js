// Inject CSS with auth styles
const style = document.createElement("style");
style.textContent = `
  @keyframes glitch { 0% { transform: translate(0); } 20% { transform: translate(-2px, 2px); } 40% { transform: translate(-2px, -2px); } 60% { transform: translate(2px, 2px); } 80% { transform: translate(2px, -2px); } 100% { transform: translate(0); } }
  @keyframes neonGlow { 0%, 100% { text-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 20px #00ffff; } 50% { text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #00ffff; } }
  body { font-family: 'Courier New', monospace; background: linear-gradient(45deg, #0d0d0d, #1a001a); color: #fff; margin: 0; padding: 20px; overflow-x: hidden; }
  .container { max-width: 700px; margin: 0 auto; background: rgba(0, 0, 0, 0.8); border: 2px solid #ff00ff; border-radius: 15px; padding: 20px; box-shadow: 0 0 15px #00ffff; }
  h1 { text-align: center; color: #ff00ff; animation: neonGlow 2s infinite; font-size: 28px; }
  .ip-notice { text-align: center; font-size: 12px; color: #00ffff; margin-bottom: 20px; }
  .auth-section, .messenger-section { margin-top: 20px; }
  .login-form, .register-form { display: flex; flex-direction: column; gap: 10px; }
  input { padding: 10px; border: 1px solid #00ffff; border-radius: 5px; background: #1a1a1a; color: #fff; font-size: 14px; }
  input:focus { border-color: #ff00ff; box-shadow: 0 0 10px #ff00ff; outline: none; }
  button { padding: 12px 25px; border: none; border-radius: 5px; background: #ff00ff; color: #fff; cursor: pointer; font-size: 16px; transition: transform 0.2s, background 0.3s; }
  button:hover { transform: scale(1.05); background: #00ffff; color: #000; }
  a { color: #00ffff; text-decoration: none; }
  a:hover { text-decoration: underline; }
  .message-input { display: flex; gap: 15px; margin: 20px 0; }
  #message { flex: 1; }
  .messages { max-height: 450px; overflow-y: auto; padding: 15px; background: #0d0d0d; border: 1px solid #00ffff; border-radius: 5px; }
  .message { background: rgba(255, 0, 255, 0.1); padding: 10px; margin: 8px 0; border-radius: 5px; word-wrap: break-word; }
  .message.superuser { background: rgba(0, 255, 255, 0.3); border: 2px solid #00ffff; animation: glitch 0.5s infinite; }
  .timestamp { font-size: 11px; color: #00ffff; margin-top: 5px; }
  #clear { display: block; margin: 20px auto 0; background: #666; }
  #clear:hover { background: #ff4d4d; }
`;
document.head.appendChild(style);

// Superuser config
const SUPERUSER_EMAIL = "elsonpye@hotmail.com";
let currentUser = null;

// Initialize on load
window.onload = function () {
  const loggedInUser = localStorage.getItem("chaosCurrentUser");
  if (loggedInUser) {
    currentUser = JSON.parse(loggedInUser);
    showMessenger();
  }
};

// User management
function getUsers() {
  return JSON.parse(localStorage.getItem("chaosUsers")) || {};
}

function saveUsers(users) {
  localStorage.setItem("chaosUsers", JSON.stringify(users));
}

// Register new user
function register() {
  const email = document.getElementById("regEmail").value.trim().toLowerCase();
  const password = document.getElementById("regPassword").value;
  if (!email || !password) {
    alert("Email and password required!");
    return;
  }

  const users = getUsers();
  if (users[email]) {
    alert("User already exists!");
    return;
  }

  users[email] = {
    password: btoa(password), // Simple base64 encoding (not secure, just for demo)
    isSuperuser: email === SUPERUSER_EMAIL,
  };
  saveUsers(users);

  currentUser = { email, isSuperuser: email === SUPERUSER_EMAIL };
  localStorage.setItem("chaosCurrentUser", JSON.stringify(currentUser));
  alert("Registered! Welcome to the Chaos.");
  showMessenger();
}

// Login existing user
function login() {
  const email = document
    .getElementById("loginEmail")
    .value.trim()
    .toLowerCase();
  const password = document.getElementById("loginPassword").value;
  const users = getUsers();

  if (!users[email] || users[email].password !== btoa(password)) {
    alert("Invalid email or password!");
    return;
  }

  currentUser = { email, isSuperuser: email === SUPERUSER_EMAIL };
  localStorage.setItem("chaosCurrentUser", JSON.stringify(currentUser));
  showMessenger();
}

// Logout
function logout() {
  currentUser = null;
  localStorage.removeItem("chaosCurrentUser");
  showAuth();
}

// Toggle UI sections
function showMessenger() {
  document.getElementById("authSection").style.display = "none";
  document.getElementById("messengerSection").style.display = "block";
  document.getElementById("currentUser").textContent = currentUser.email;
  loadMessages();
}

function showAuth() {
  document.getElementById("authSection").style.display = "block";
  document.getElementById("messengerSection").style.display = "none";
  document.getElementById("loginEmail").value = "";
  document.getElementById("loginPassword").value = "";
  document.getElementById("regEmail").value = "";
  document.getElementById("regPassword").value = "";
}

function showRegister() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "block";
}

function showLogin() {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("registerForm").style.display = "none";
}

// Censoring logic
function censorText(text) {
  if (currentUser && currentUser.isSuperuser) return text;
  const badWords = ["fuck", "shit", "damn", "ass"];
  let censored = text;
  badWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    const glitchCensor = "GL1TCH"
      .split("")
      .map((c) => (Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()))
      .join("");
    censored = censored.replace(regex, glitchCensor);
  });
  return censored;
}

// Send message
function sendMessage() {
  const input = document.getElementById("message");
  let text = input.value.trim();
  if (text === "") return;

  text = censorText(text);
  const timestamp = new Date().toLocaleString();
  const message = { text, timestamp, superuser: currentUser.isSuperuser };

  let messages = JSON.parse(localStorage.getItem("chaosMessages")) || [];
  messages.push(message);
  localStorage.setItem("chaosMessages", JSON.stringify(messages));

  input.value = "";
  loadMessages();
}

// Load messages
function loadMessages() {
  const messagesDiv = document.getElementById("messages");
  let messages = JSON.parse(localStorage.getItem("chaosMessages")) || [];

  messagesDiv.innerHTML = "";
  messages.forEach((msg) => {
    const div = document.createElement("div");
    div.className = "message";
    if (msg.superuser) div.classList.add("superuser");
    div.innerHTML = `${msg.text}<div class="timestamp">${msg.timestamp}</div>`;
    messagesDiv.appendChild(div);
  });
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Clear messages
function clearMessages() {
  localStorage.removeItem("chaosMessages");
  loadMessages();
}

// Enter key support
document.getElementById("message").addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});
