/* =============================================
   MAXCI X BINANCI — SCRIPT.JS
   Handles: Loader, Nav, Scroll Reveal, Counters,
   FAQ, Form, Mini Chart, Live Price Simulation,
   Canvas Particles, Back-to-Top
============================================= */

// ---- LOADER ----
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 2200);
});

// ---- NAVBAR ----
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  // Back to top
  const btn = document.getElementById('back-to-top');
  if (btn) {
    if (window.scrollY > 400) btn.classList.add('visible');
    else btn.classList.remove('visible');
  }
});

hamburger && hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// Back to top
const backBtn = document.getElementById('back-to-top');
backBtn && backBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- ACTIVE NAV LINK ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    const offset = sec.offsetTop - 120;
    if (window.scrollY >= offset) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}, { passive: true });

// ---- SCROLL REVEAL ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---- ANIMATED COUNTERS ----
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 2000;
  const steps = 60;
  const step = target / steps;
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, duration / steps);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);

// ---- FAQ ACCORDION ----
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  q && q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ---- CONTACT FORM ----
const form = document.getElementById('contactForm');
form && form.addEventListener('submit', (e) => {
  e.preventDefault();
  const success = document.getElementById('formSuccess');
  if (success) {
    success.classList.add('show');
    setTimeout(() => success.classList.remove('show'), 5000);
  }
  form.reset();
});

// ---- MINI CHART (canvas sparkline) ----
function drawMiniChart() {
  const container = document.getElementById('miniChart');
  if (!container) return;

  const points = [42, 38, 45, 41, 55, 52, 60, 58, 65, 62, 70, 68, 75, 72, 80];
  const w = container.offsetWidth || 280;
  const h = 80;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.setAttribute('preserveAspectRatio', 'none');

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const pad = 6;

  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * (w - 2 * pad) + pad;
    const y = h - pad - ((p - min) / range) * (h - 2 * pad);
    return `${x},${y}`;
  });

  // Gradient fill
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
  grad.setAttribute('id', 'chartGrad');
  grad.setAttribute('x1', '0'); grad.setAttribute('y1', '0');
  grad.setAttribute('x2', '0'); grad.setAttribute('y2', '1');
  const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('stop-color', '#0ECB81');
  stop1.setAttribute('stop-opacity', '0.3');
  const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop2.setAttribute('offset', '100%');
  stop2.setAttribute('stop-color', '#0ECB81');
  stop2.setAttribute('stop-opacity', '0');
  grad.appendChild(stop1); grad.appendChild(stop2);
  defs.appendChild(grad);
  svg.appendChild(defs);

  // Area
  const areaPath = `M ${coords.join(' L ')} L ${w - pad},${h} L ${pad},${h} Z`;
  const area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  area.setAttribute('d', areaPath);
  area.setAttribute('fill', 'url(#chartGrad)');
  svg.appendChild(area);

  // Line
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  line.setAttribute('points', coords.join(' '));
  line.setAttribute('fill', 'none');
  line.setAttribute('stroke', '#0ECB81');
  line.setAttribute('stroke-width', '2');
  line.setAttribute('stroke-linecap', 'round');
  line.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(line);

  container.appendChild(svg);
}
drawMiniChart();

// ---- LIVE BTC PRICE SIMULATION ----
let btcPrice = 97420.50;
function simulateLivePrice() {
  const el = document.getElementById('liveBTC');
  if (!el) return;
  const change = (Math.random() - 0.5) * 80;
  btcPrice = Math.max(90000, btcPrice + change);
  el.textContent = '$' + btcPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  el.className = 't-price ' + (change >= 0 ? 'up' : 'down');
}
setInterval(simulateLivePrice, 2500);

// ---- MARKET TABLE FLICKER ----
function flickerMarketTable() {
  const rows = document.querySelectorAll('#marketTableBody tr');
  rows.forEach(row => {
    if (Math.random() > 0.6) {
      const priceEl = row.querySelector('.price');
      const changeEl = row.querySelector('.change');
      if (!priceEl || !changeEl) return;
      const priceText = priceEl.textContent.replace(/[$,]/g, '');
      const price = parseFloat(priceText);
      if (isNaN(price)) return;
      const delta = (Math.random() - 0.5) * (price * 0.002);
      const newPrice = Math.max(0.001, price + delta);
      const formatted = newPrice >= 1000
        ? '$' + newPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : '$' + newPrice.toFixed(4);
      priceEl.textContent = formatted;
      priceEl.style.transition = 'color 0.3s';
      priceEl.style.color = delta >= 0 ? 'var(--up)' : 'var(--down)';
      setTimeout(() => priceEl.style.color = '', 500);
    }
  });
}
setInterval(flickerMarketTable, 3000);

// ---- HERO CANVAS PARTICLES ----
const canvas = document.getElementById('heroCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.5 ? '240,185,11' : '0,245,212'
    };
  }

  for (let i = 0; i < 120; i++) particles.push(createParticle());

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(240,185,11,${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    // Draw dots
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });
    animId = requestAnimationFrame(drawParticles);
  }
  drawParticles();
}

// ---- SMOOTH SCROLL FOR ALL ANCHOR LINKS ----
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- STAGGERED REVEAL FOR GRID CARDS ----
document.querySelectorAll('.services-grid .service-card, .why-grid .why-card, .testi-grid .testi-card, .pricing-grid .pricing-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 80}ms`;
});

console.log('%cMaxci X Binanci — Elite Crypto Trading', 'color:#F0B90B;font-size:18px;font-weight:bold;');
console.log('%cBuilt with precision. Designed for winners.', 'color:#00F5D4;font-size:11px;');
