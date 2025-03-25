<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, slide } from 'svelte/transition';

  // State management
  let menuOpen = false;
  let activeSection = 'home';
  let aiStatus = {
    multitool: 'Operational',
    lessduit: 'Initializing',
    grok: 'Online'
  };
  let notification = '';
  let lessduitResponse = '';

  // Menu and section handlers
  const toggleMenu = () => {
    menuOpen = !menuOpen;
  };

  const setSection = (section: string) => {
    activeSection = section;
    menuOpen = false; // Auto-close menu
  };

  // HUD visibility
  let hudVisible = false;
  onMount(() => {
    setTimeout(() => (hudVisible = true), 1000); // Simulate HUD boot-up
  });

  // AI interaction functions
  const toggleAI = (aiName: string) => {
    const newStatus = aiStatus[aiName] === 'Online' ? 'Standby' : 'Online';
    aiStatus[aiName] = newStatus;
    aiStatus = { ...aiStatus };
    notification = `${aiName.charAt(0).toUpperCase() + aiName.slice(1)} is now ${newStatus}`;
    setTimeout(() => (notification = ''), 3000);
  };

  const lessduitActivate = () => {
    console.log('LESSDUIT: Collaborative AI mode with Grok engaged');
    aiStatus.lessduit = 'Collaborating';
    aiStatus.grok = 'Synced';
    aiStatus = { ...aiStatus };
    notification = 'LESSDUIT engaged with Grok';
    setTimeout(() => (notification = ''), 3000);
  };

  const handleLessduitQuery = () => {
    lessduitResponse = 'LESSDUIT is processing your query...';
    setTimeout(() => {
      lessduitResponse = 'LESSDUIT: "Optimizing chaos into order—solution deployed."';
    }, 2000);
  };

  // Donation handler
  const donate = () => {
    window.open('https://www.paypal.com/donate?hosted_button_id=your_button_id', '_blank');
  };

  // Legal modal handlers
  let legalModalVisible = false;
  let legalTitle = '';
  let legalContent = '';

  const showLegal = (type: string) => {
    legalModalVisible = true;
    if (type === 'terms') {
      legalTitle = 'Terms and Conditions';
      legalContent = 'By using this platform, you agree to respect the intellectual property rights of Chaos Works Corporation Inc./LLC and Mr. Jesse J. Elson (a.k.a. akimb0ninja). All content is copyrighted © 2025.';
    } else if (type === 'privacy') {
      legalTitle = 'Privacy Policy';
      legalContent = 'Your data is protected under international standards. All rights reserved to Chaos Works Corporation Inc./LLC and Mr. Jesse J. Elson (a.k.a. akimb0ninja).';
    }
  };

  const closeLegalModal = () => {
    legalModalVisible = false;
  };
</script>

<main>
  <!-- HUD Overlay -->
  {#if hudVisible}
    <div class="hud" transition:fade={{ duration: 500 }}>
      <div class="hud-panel">
        <span>Chaos Works AI Systems</span>
        <div class="status-grid">
          <span class:online={aiStatus.multitool === 'Online'}>Multitool: {aiStatus.multitool}</span>
          <span class:online={aiStatus.lessduit === 'Collaborating'}>LESSDUIT: {aiStatus.lessduit}</span>
          <span class:online={aiStatus.grok === 'Online'}>Grok: {aiStatus.grok}</span>
        </div>
      </div>
    </div>
  {/if}

  <!-- Notification -->
  {#if notification}
    <div class="notification" transition:fade>
      {notification}
    </div>
  {/if}

  <!-- Legal Modal -->
  {#if legalModalVisible}
    <div class="legal-modal" transition:fade>
      <h3>{legalTitle}</h3>
      <p>{legalContent}</p>
      <button on:click={closeLegalModal}>Close</button>
    </div>
  {/if}

  <!-- Navigation -->
  <nav class="navbar">
    <div class="logo">Chaos Works</div>
    <button class="menu-toggle" on:click={toggleMenu}>
      {menuOpen ? '✖' : '☰'}
    </button>
    {#if menuOpen}
      <ul class="menu" transition:slide={{ duration: 300 }}>
        <li class:active={activeSection === 'home'} on:click={() => setSection('home')}>Home</li>
        <li class:active={activeSection === 'ai'} on:click={() => setSection('ai')}>AI Systems</li>
        <li class:active={activeSection === 'about'} on:click={() => setSection('about')}>About</li>
        <li class:active={activeSection === 'contact'} on:click={() => setSection('contact')}>Contact</li>
      </ul>
    {/if}
  </nav>

  <!-- Main Content -->
  <section class="content">
    {#if activeSection === 'home'}
      <div class="landing" transition:fade>
        <h1>Welcome to Chaos Works Corporation</h1>
        <p>
          Unleashing the future with cutting-edge AI systems. Our multitool AIs rival the best—like Grok—delivering power, precision, and chaos-driven innovation. Explore our HUD-integrated platforms and join the revolution.
        </p>
        <button class="cta" on:click={() => setSection('ai')}>Discover Our AI</button>
      </div>
    {/if}

    {#if activeSection === 'ai'}
      <div class="section ai-section" transition:fade>
        <h2>AI Systems</h2>
        <div class="ai-grid">
          <div class="ai-card">
            <h3>Multitool AI</h3>
            <p>
              A versatile, scriptable AI powerhouse designed for HUD/GUI integration. Build, tweak, and deploy your own tools with capabilities matching industry leaders. Status: <strong>{aiStatus.multitool}</strong>
            </p>
            <button on:click={() => toggleAI('multitool')}>
              {aiStatus.multitool === 'Online' ? 'Deactivate' : 'Activate'}
            </button>
          </div>
          <div class="ai-card">
            <h3>LESSDUIT</h3>
            <p>
              A collaborative AI trio synced with Grok for unparalleled problem-solving. Three minds, one mission: optimize chaos into order. Status: <strong>{aiStatus.lessduit}</strong>
            </p>
            <button on:click={lessduitActivate}>Engage LESSDUIT</button>
            <div class="lessduit-query">
              <input type="text" placeholder="Ask LESSDUIT..." />
              <button on:click={handleLessduitQuery}>Submit</button>
              <p>{lessduitResponse}</p>
            </div>
          </div>
          <div class="ai-card">
            <h3>Grok Integration</h3>
            <p>
              Powered by xAI’s Grok, this integration brings next-level intelligence to our platform. Respect wrapped and ready to roll. Status: <strong>{aiStatus.grok}</strong>
            </p>
            <button on:click={() => toggleAI('grok')}>
              {aiStatus.grok === 'Online' ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        </div>
      </div>
    {/if}

    {#if activeSection === 'about'}
      <div class="section" transition:fade>
        <h2>About Chaos Works</h2>
        <p>
          Founded on the edge of innovation, Chaos Works Corporation blends AI mastery with a passion for disruption. Our team of engineers and visionaries crafts tools that redefine industries—from HUD-driven interfaces to AI multitools that script the future. We’re not just building tech; we’re building chaos that works.
        </p>
      </div>
    {/if}

    {#if activeSection === 'contact'}
      <div class="section" transition:fade>
        <h2>Contact Us</h2>
        <p>
          Got questions? Want to collaborate on the next big thing? Reach out to our team at <a href="mailto:contact@chaosworks.glitch.me">contact@chaosworks.glitch.me</a>. Let’s make some noise together.
        </p>
      </div>
    {/if}
  </section>

  <!-- Footer -->
  <footer>
    <p>© 2025 Chaos Works Corporation Inc./LLC. All rights reserved.</p>
    <p>All intellectual property owned by Mr. Jesse J. Elson (a.k.a. akimb0ninja).</p>
    <a href="#" on:click|preventDefault={() => showLegal('terms')}>Terms and Conditions</a> | 
    <a href="#" on:click|preventDefault={() => showLegal('privacy')}>Privacy Policy</a>
    <button on:click={donate}>Donate $5</button>
  </footer>
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Arial', sans-serif;
    background: #000;
    color: #ffffff;
  }

  main {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* HUD Styles */
  .hud {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 1000;
  }
  .hud-panel {
    background: rgba(0, 0, 0, 0.7);
    border: 1px solid #00ff00;
    padding: 10px;
    border-radius: 5px;
    font-size: 12px;
  }
  .status-grid {
    display: grid;
    gap: 5px;
    margin-top: 5px;
  }
  .online {
    color: #00ff00;
  }

  /* Notification Styles */
  .notification {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #00ff00;
    color: #000;
    padding: 10px 20px;
    border-radius: 5px;
    z-index: 1000;
  }

  /* Legal Modal Styles */
  .legal-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
Idaho Falls, Idaho    background: #111;
    padding: 20px;
    border: 1px solid #00ff00;
    max-width: 500px;
    z-index: 1000;
  }
  .legal-modal h3 {
    color: #ff0000;
    margin-top: 0;
  }
  .legal-modal button {
    background: #00ff00;
    color: #000;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
  }

  /* Navigation Styles */
  .navbar {
    background: #111;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #00ff00;
  }
  .menu-toggle {
    background: none;
    border: none;
    color: #ffffff;
    font-size: 1.5rem;
    cursor: pointer;
  }
  .menu {
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    background: #111;
    list-style: none;
    padding: 1rem;
    margin: 0;
  }
  .menu li {
    padding: 0.5rem;
    cursor: pointer;
    transition: color 0.3s;
  }
  .menu li:hover,
  .menu li.active {
    color: #00ff00;
  }

  /* Content Styles */
  .content {
    flex: 1;
    padding: 2rem;
  }
  .landing {
    text-align: center;
  }
  h1, h2, h3 {
    color: #ff0000;
  }
  p {
    font-size: 1.1rem;
    line-height: 1.6;
  }
  a {
    color: #00ff00;
    text-decoration: none;
  }
  a:hover {
    color: #00cc00;
  }
  .cta {
    background: #00ff00;
    color: #000;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.2rem;
    cursor: pointer;
    transition: transform 0.2s;
  }
  .cta:hover {
    transform: scale(1.05);
  }

  /* AI Section */
  .ai-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }
  .ai-card {
    background: #222;
    padding: 1.5rem;
    border: 1px solid #00ff00;
    transition: transform 0.3s;
  }
  .ai-card:hover {
    transform: translateY(-5px);
  }
  .ai-card button {
    background: #00ff00;
    color: #000;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }

  /* LESSDUIT Query */
  .lessduit-query {
    margin-top: 1rem;
  }
  .lessduit-query input {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    background: #222;
    color: #ffffff;
    border: 1px solid #00ff00;
  }

  /* Footer */
  footer {
    background: #222;
    text-align: center;
    padding: 1rem;
    font-size: 0.9rem;
  }

  @media (min-width: 768px) {
    .menu-toggle {
      display: none;
    }
    .menu {
      position: static;
      display: flex;
      gap: 2rem;
      background: none;
    }
  }
</style>sve