// Custom Cyber Follower Cursor
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursorDot) {
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  }
});

function renderCursor() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  if (cursorRing) {
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
  }
  requestAnimationFrame(renderCursor);
}
renderCursor();

// Magnetic Targets Effect
const magneticTargets = document.querySelectorAll('.magnetic-target');
magneticTargets.forEach((target) => {
  target.addEventListener('mousemove', (e) => {
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    target.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });
  target.addEventListener('mouseleave', () => {
    target.style.transform = 'translate(0px, 0px)';
  });
});

// Web Audio API Synthesizer Sound Effects
let soundEnabled = true;
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSynthTone(freq = 440, duration = 0.05, type = 'sine') {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

const soundToggleBtn = document.getElementById('sound-toggle');
if (soundToggleBtn) {
  soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundToggleBtn.textContent = soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF';
    playSynthTone(soundEnabled ? 880 : 220, 0.1);
  });
}

// Background Particle Canvas Mesh
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let width, height, particles;
const particleCount = 65;

function initCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2 + 1
    });
  }
}

window.addEventListener('resize', initCanvas);

function animateCanvas() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach((p, index) => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.fill();

    for (let j = index + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 - dist / 800})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  });
  requestAnimationFrame(animateCanvas);
}
initCanvas();
animateCanvas();

// 3D Tilt Card Effect
const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  });
});

// Interactive Terminal CLI Prompt
const termInput = document.getElementById('term-input');
const termResponse = document.getElementById('term-response');

if (termInput) {
  termInput.addEventListener('keydown', (e) => {
    playSynthTone(600, 0.02);
    if (e.key === 'Enter') {
      playSynthTone(1200, 0.08);
      const cmd = termInput.value.trim().toLowerCase();
      termInput.value = '';
      let res = '';

      switch (cmd) {
        case 'help':
          res = 'Available commands: <span class="command">stack</span>, <span class="command">projects</span>, <span class="command">matrix</span>, <span class="command">contact</span>, <span class="command">clear</span>';
          break;
        case 'stack':
          res = 'Languages: TS, JS, C++, Python, SQL<br>Mobile/FE: React Native (Expo), React, Next.js, Tailwind<br>BE/DB: Node.js, Express, Postgres (Neon), MongoDB, AWS EC2';
          break;
        case 'projects':
          res = '1. 🚕 <b>Ryde</b> — Full-stack ride booking app (React Native, Neon Postgres, Razorpay)<br>2. ❤️ <b>VitalSync</b> — IoT patient telemetry (Health Connect API, Express, MongoDB, AWS)';
          break;
        case 'matrix':
          res = '⚡ Matrix signal status: ONLINE. All microservices operating at 99.99% throughput.';
          break;
        case 'contact':
          res = 'Email: agaman1518@gmail.com<br>GitHub: github.com/Amanag43<br>LinkedIn: linkedin.com/in/aman-agarwal-396921245';
          break;
        case 'clear':
          res = '';
          break;
        default:
          res = `Command not recognized: '${cmd}'. Type <span class="command">help</span> for assistance.`;
      }
      termResponse.innerHTML = res;
    }
  });
}

// Project Filter Tabs
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    playSynthTone(750, 0.04);
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');
    projectCards.forEach((card) => {
      const categories = card.getAttribute('data-category') || '';
      if (filter === 'all' || categories.includes(filter)) {
        card.style.display = 'grid';
        card.style.opacity = '1';
      } else {
        card.style.display = 'none';
        card.style.opacity = '0';
      }
    });
  });
});

// Code Drawer Toggle
const toggleBtns = document.querySelectorAll('.code-toggle-btn');
toggleBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    playSynthTone(500, 0.05);
    const targetId = btn.getAttribute('data-target');
    const drawer = document.getElementById(targetId);
    if (drawer) {
      const isHidden = drawer.hasAttribute('hidden');
      if (isHidden) {
        drawer.removeAttribute('hidden');
        btn.textContent = '>_ Hide Code Drawer';
      } else {
        drawer.setAttribute('hidden', '');
        btn.textContent = '>_ View Code Drawer';
      }
    }
  });
});

// Scroll Reveal Observer
const scrollElements = document.querySelectorAll('.scroll-reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.15 });

scrollElements.forEach((el) => observer.observe(el));

// Dynamic Number Count-Up Animation
const countElements = document.querySelectorAll('.count-up');
let counted = false;

window.addEventListener('scroll', () => {
  if (counted) return;
  const metricsSection = document.getElementById('metrics');
  if (metricsSection) {
    const rect = metricsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      counted = true;
      countElements.forEach((el) => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        let count = 0;
        const speed = target / 30;
        const update = () => {
          count += speed;
          if (count < target) {
            el.textContent = Math.ceil(count);
            setTimeout(update, 40);
          } else {
            el.textContent = target;
          }
        };
        update();
      });
    }
  }
});

// Fetch Live GitHub Repositories for Amanag43
async function fetchLiveRepos() {
  const repoContainer = document.getElementById('live-github-repos');
  if (!repoContainer) return;

  try {
    const res = await fetch('https://api.github.com/users/Amanag43/repos?sort=updated&per_page=6');
    if (!res.ok) throw new Error('Failed to fetch');
    const repos = await res.json();

    repoContainer.innerHTML = '';
    repos.forEach((repo) => {
      const card = document.createElement('div');
      card.className = 'repo-card tilt-card';
      card.innerHTML = `
        <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
        <p class="repo-desc">${repo.description || 'Public repository by Aman Agarwal.'}</p>
        <div class="repo-meta mono-text">
          <span>⚡ ${repo.language || 'Code'}</span>
          <span>⭐ ${repo.stargazers_count}</span>
          <span>🍴 ${repo.forks_count}</span>
        </div>
      `;
      repoContainer.appendChild(card);
    });
  } catch (err) {
    repoContainer.innerHTML = `
      <div class="repo-card mono-text">
        <p>🔗 <a href="https://github.com/Amanag43" target="_blank" style="color: var(--accent-cyan);">View all 25+ repositories directly on github.com/Amanag43 ↗</a></p>
      </div>
    `;
  }
}
fetchLiveRepos();

// Live Footer Clock
function updateClock() {
  const timeElem = document.getElementById('live-time');
  if (timeElem) {
    const now = new Date();
    timeElem.textContent = `New Delhi: ${now.toLocaleTimeString()}`;
  }
}
setInterval(updateClock, 1000);
updateClock();
