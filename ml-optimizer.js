// Machine Learning Infrastructure for Chaos Works Optimization
// Memory Bank and Self-Networking System

// Inject minimal CSS for ML status
const style = document.createElement("style");
style.textContent = `
  .ml-status {
    position: fixed;
    bottom: 10px;
    right: 10px;
    background: rgba(0, 255, 255, 0.2);
    padding: 5px 10px;
    border-radius: 5px;
    color: #00ffff;
    font-size: 12px;
    z-index: 1000;
  }
`;
document.head.appendChild(style);

// ML Config
const SUPERUSER_EMAIL = "elsonpye@hotmail.com";
const ML_CONFIG = {
  learningRate: 0.1,
  cacheThreshold: 5, // Messages before caching
  predictionWindow: 1000 * 60, // 1 minute prediction window
};

// Memory Bank (using localStorage as a persistent store)
class MemoryBank {
  constructor() {
    this.messages = JSON.parse(localStorage.getItem("chaosMessages")) || [];
    this.users = JSON.parse(localStorage.getItem("chaosUsers")) || {};
    this.cache = new Map();
  }

  saveMessages(messages) {
    this.messages = messages;
    localStorage.setItem("chaosMessages", JSON.stringify(messages));
  }

  saveUsers(users) {
    this.users = users;
    localStorage.setItem("chaosUsers", JSON.stringify(users));
  }

  cachePrediction(key, value) {
    this.cache.set(key, value);
  }

  getPrediction(key) {
    return this.cache.get(key);
  }
}

// Self-Networking ML Model (Simple Linear Regression for Behavior Prediction)
class ChaosML {
  constructor() {
    this.memory = new MemoryBank();
    this.weights = { messageFreq: 0.5, userActivity: 0.5 };
    this.statusDiv = document.createElement("div");
    this.statusDiv.className = "ml-status";
    document.body.appendChild(this.statusDiv);
    this.updateStatus("Initializing ML...");
  }

  updateStatus(message) {
    this.statusDiv.textContent = `ML Status: ${message}`;
  }

  // Train on user behavior (frequency of messages, login times)
  train() {
    const messages = this.memory.messages;
    const users = this.memory.users;
    const now = Date.now();

    // Calculate message frequency (messages per minute)
    const recentMessages = messages.filter(
      (m) => now - new Date(m.timestamp).getTime() < ML_CONFIG.predictionWindow
    );
    const freq = recentMessages.length / (ML_CONFIG.predictionWindow / 60000);

    // Adjust weights based on activity
    this.weights.messageFreq +=
      ML_CONFIG.learningRate * (freq - this.weights.messageFreq);
    this.weights.userActivity +=
      ML_CONFIG.learningRate *
      (Object.keys(users).length - this.weights.userActivity);

    this.updateStatus(`Training... Freq: ${freq.toFixed(2)} messages/min`);
  }

  // Predict resource needs and optimize
  predict() {
    const freqWeight = this.weights.messageFreq;
    const userWeight = this.weights.userActivity;
    const score = (freqWeight * 0.7 + userWeight * 0.3).toFixed(2);

    // Cache messages if frequency exceeds threshold
    if (freqWeight > ML_CONFIG.cacheThreshold) {
      this.memory.cachePrediction(
        "nextMessages",
        this.memory.messages.slice(-10)
      );
      this.updateStatus(
        `High Activity Detected (Score: ${score}) - Cached Messages`
      );
    } else {
      this.updateStatus(`Stable (Score: ${score})`);
    }

    return score;
  }

  // Optimize DOM updates
  optimizeDOM(messagesDiv, messages) {
    const cached = this.memory.getPrediction("nextMessages");
    if (
      cached &&
      messages.length === cached.length &&
      messages.every((m, i) => m.text === cached[i].text)
    ) {
      this.updateStatus("Optimized: Using Cached DOM");
      return;
    }

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
}

// Integrate with existing site
const ml = new ChaosML();

// Override existing functions with ML optimization
const originalLoadMessages = window.loadMessages;
window.loadMessages = function () {
  ml.train();
  ml.predict();
  const messagesDiv = document.getElementById("messages");
  const messages = JSON.parse(localStorage.getItem("chaosMessages")) || [];
  ml.optimizeDOM(messagesDiv, messages);
};

const originalSendMessage = window.sendMessage;
window.sendMessage = function () {
  originalSendMessage();
  ml.train();
  ml.predict();
};

// Periodic training
setInterval(() => {
  ml.train();
  ml.predict();
}, ML_CONFIG.predictionWindow);
