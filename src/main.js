import { getStoredData } from './data.js';
import { Research3DBanner } from './scene3d.js';

document.addEventListener('DOMContentLoaded', () => {
  // Fetch fresh dynamic data
  const cvData = getStoredData();

  // 1. Initialize Embedded Research 3D Banner
  const researchBanner = new Research3DBanner('research-3d-canvas');

  // 2. Render All Dynamic CV Content
  renderHeroAndAbout(cvData);
  renderResearch(cvData, researchBanner);
  renderPublications(cvData);
  renderTalks(cvData);
  renderJourney(cvData);
  renderConferences(cvData);
  renderSkills(cvData);
  setupContactForm();
  setupNavigation(researchBanner);
  setupModal();
  setup3DTiltCards();
  animateCounters();
});

// Render Dynamic Hero & About Content
function renderHeroAndAbout(cvData) {
  if (!cvData || !cvData.personal) return;
  const p = cvData.personal;

  const heroSubtitle = document.querySelector('.hero-subtitle');
  if (heroSubtitle && p.tagline) heroSubtitle.innerText = p.tagline;

  const aboutGrid = document.querySelector('.about-grid');
  if (aboutGrid && p.bioP1) {
    aboutGrid.querySelector('.about-text-card p:nth-of-type(1)').innerHTML = p.bioP1;
    if (p.bioP2) {
      aboutGrid.querySelector('.about-text-card p:nth-of-type(2)').innerHTML = p.bioP2;
    }
    if (p.quote) {
      const quoteP = aboutGrid.querySelector('.quote-box p');
      if (quoteP) quoteP.innerText = p.quote;
    }
  }
}

// Render Research Focus & 3D Symbol Cards
function renderResearch(cvData, researchBanner) {
  const container = document.getElementById('research-grid');
  if (!container || !cvData.researchInterests) return;

  container.innerHTML = cvData.researchInterests.map((item, index) => `
    <div class="glass-card research-card card-3d-tilt ${index === 0 ? 'active' : ''}" data-number="${item.highlightNumber.split(',')[0].trim()}">
      <span class="research-card-num">${item.highlightNumber}</span>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
    </div>
  `).join('');

  // Interactive Click Handlers on Research Cards
  const cards = container.querySelectorAll('.research-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const num = card.getAttribute('data-number');
      updateSymbolDisplay(num);

      if (researchBanner) {
        researchBanner.loadSymbol(num);
      }
    });
  });
}

function updateSymbolDisplay(num) {
  const badge = document.getElementById('active-symbol-badge');
  const title = document.getElementById('active-symbol-title');
  const desc = document.getElementById('active-symbol-desc');

  if (num === '1' || num === '7') {
    if (badge) badge.innerText = 'Active Geometry: Node 1 (Ek / Unity)';
    if (title) title.innerText = 'Ek Onkar — Unity & Metaphysical Foundation';
    if (desc) desc.innerText = 'The numerical principle of Unity (1) forms the ontological foundation of Sikh theology—expressing non-duality, infinite sovereignty, and divine oneness.';
  } else if (num === '8') {
    if (badge) badge.innerText = 'Active Geometry: Node 8 (Torus Knot)';
    if (title) title.innerText = 'The Shape of Eight — Timelessness & Transformation';
    if (desc) desc.innerText = 'Analyzed in Makrand Journal (Issue 10th), the number eight symbolizes the intersection of the finite temporal world and the infinite realm, continuous renewal, and timeless transformation.';
  } else if (num === '40') {
    if (badge) badge.innerText = 'Active Geometry: Node 40 (Dodecahedron)';
    if (title) title.innerText = 'The Symbolic Resonance of Forty';
    if (desc) desc.innerText = 'Featured in Makrand Journal (Issue 9th), forty serves as a symbolic benchmark of spiritual maturation, trial, discipline, and cosmic completion in sacred texts.';
  }
}

// Render Publications Grid
function renderPublications(cvData) {
  const container = document.getElementById('publications-grid');
  if (!container || !cvData.publications) return;

  container.innerHTML = cvData.publications.map(pub => `
    <div class="glass-card pub-card card-3d-tilt">
      <div>
        <span class="pub-tag">${pub.type}</span>
        <h3>${pub.title}</h3>
        <div class="pub-meta">${pub.journal} • ${pub.date}</div>
        <p class="pub-abstract">${pub.abstract}</p>
      </div>
      <div class="pub-footer">
        <span class="pub-publisher">${pub.publisher}</span>
        <a href="${pub.link}" target="_blank" rel="noopener" class="btn btn-small btn-primary">
          Read Flipbook ↗
        </a>
      </div>
    </div>
  `).join('');
}

// Render Talks & Lectures
function renderTalks(cvData) {
  const container = document.getElementById('talks-wrapper');
  if (!container || !cvData.talks) return;

  container.innerHTML = cvData.talks.map(talk => `
    <div class="glass-card talk-card card-3d-tilt">
      <div class="video-preview-wrapper" id="talk-video-preview">
        <img src="https://img.youtube.com/vi/${talk.youtubeId || 'E8isUpse27s'}/hqdefault.jpg" alt="${talk.title}" class="video-thumb">
        <div class="play-overlay" data-youtube-id="${talk.youtubeId || 'E8isUpse27s'}">
          <div class="play-btn-circle">▶</div>
        </div>
      </div>

      <div class="talk-info">
        <span class="section-tag">${talk.event}</span>
        <h3>${talk.title}</h3>
        <div class="talk-event">📍 ${talk.location} • ${talk.date}</div>
        <p class="talk-desc">${talk.description}</p>
        <div class="talk-actions">
          <button class="btn btn-primary open-video-btn" data-youtube-id="${talk.youtubeId || 'E8isUpse27s'}">
            Watch Lecture Video ▶
          </button>
          <a href="${talk.link}" target="_blank" rel="noopener" class="btn btn-glass">
            Open YouTube ↗
          </a>
        </div>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('[data-youtube-id]').forEach(elem => {
    elem.addEventListener('click', (e) => {
      e.preventDefault();
      const ytId = elem.getAttribute('data-youtube-id');
      openVideoModal(ytId);
    });
  });
}

// Render Journey Timeline
function renderJourney(cvData) {
  const container = document.getElementById('journey-timeline');
  if (!container) return;

  const combinedJourney = [
    ...(cvData.education || []).map(edu => ({
      type: 'Education & Honors',
      title: edu.degree,
      institution: edu.institution,
      period: edu.year,
      badge: edu.badge,
      desc: edu.details
    })),
    ...(cvData.experience || []).map(exp => ({
      type: 'Teaching & Professorship',
      title: exp.role,
      institution: `${exp.institution}, ${exp.location}`,
      period: exp.period,
      badge: 'Faculty Role',
      desc: exp.responsibilities
    }))
  ];

  container.innerHTML = combinedJourney.map(item => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-content glass-card card-3d-tilt">
        <span class="badge-tag">${item.badge}</span>
        <h3>${item.title}</h3>
        <div class="timeline-institution">${item.institution}</div>
        <div class="timeline-year">📅 ${item.period}</div>
        <p class="timeline-desc">${item.desc}</p>
      </div>
    </div>
  `).join('');
}

// Render Conferences & Webinars
function renderConferences(cvData) {
  const container = document.getElementById('conferences-grid');
  if (!container || !cvData.conferences) return;

  container.innerHTML = cvData.conferences.map(conf => `
    <div class="glass-card conf-card card-3d-tilt">
      <div class="conf-year">${conf.year}</div>
      <div class="conf-info">
        <span class="conf-type">${conf.type}</span>
        <h3>${conf.title}</h3>
        <div class="conf-org">🏛️ ${conf.organizer}</div>
      </div>
    </div>
  `).join('');
}

// Render Skills & Languages
function renderSkills(cvData) {
  const langContainer = document.getElementById('language-list');
  if (langContainer && cvData.languages) {
    langContainer.innerHTML = cvData.languages.map(lang => `
      <div class="lang-item">
        <div class="lang-header">
          <span class="lang-name">${lang.name}</span>
          <span class="lang-prof">${lang.proficiency}</span>
        </div>
        <div class="lang-bar-bg">
          <div class="lang-bar-fill" style="width: ${lang.level}%;"></div>
        </div>
      </div>
    `).join('');
  }

  const skillContainer = document.getElementById('skills-tags');
  if (skillContainer && cvData.technicalSkills) {
    skillContainer.innerHTML = cvData.technicalSkills.map(skill => `
      <span class="skill-tag">${skill}</span>
    `).join('');
  }
}

// Contact Form Handler (Saves to Admin Inbox)
function setupContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    const existing = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
    existing.unshift({
      name,
      email,
      subject,
      message,
      date: new Date().toLocaleString()
    });
    localStorage.setItem('portfolio_messages', JSON.stringify(existing));

    status.className = 'form-status success';
    status.innerText = `Thank you, ${name}! Your message has been submitted & sent to ekam1329@gmail.com.`;

    setTimeout(() => {
      const mailtoUrl = `mailto:ekam1329@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
      window.location.href = mailtoUrl;
    }, 1200);
  });
}

// Navigation & Theme Toggle Handler
function setupNavigation(researchBanner) {
  const themeBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const themeText = document.getElementById('theme-text');

  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme, researchBanner, themeIcon, themeText);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark-theme');
      const newTheme = isDark ? 'light' : 'dark';
      applyTheme(newTheme, researchBanner, themeIcon, themeText);
      localStorage.setItem('theme', newTheme);
    });
  }

  const mobileToggle = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }
}

function applyTheme(theme, researchBanner, iconElem, textElem) {
  if (theme === 'light') {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    if (iconElem) iconElem.innerText = '☀️';
    if (textElem) textElem.innerText = 'Bright Mode';
  } else {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
    if (iconElem) iconElem.innerText = '🌙';
    if (textElem) textElem.innerText = 'Dark Mode';
  }

  if (researchBanner) researchBanner.setTheme(theme);
}

// Card Interactive 3D Tilt Hover
function setup3DTiltCards() {
  document.querySelectorAll('.card-3d-tilt').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / rect.height) * 10;
      const rotateY = (x / rect.width) * 10;
      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

// Modal System
function setupModal() {
  const modalBackdrop = document.getElementById('modal-backdrop');
  const closeBtn = document.getElementById('modal-close-btn');

  if (closeBtn && modalBackdrop) {
    closeBtn.addEventListener('click', () => {
      modalBackdrop.classList.remove('open');
      const body = document.getElementById('modal-body');
      if (body) body.innerHTML = '';
    });

    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        modalBackdrop.classList.remove('open');
        const body = document.getElementById('modal-body');
        if (body) body.innerHTML = '';
      }
    });
  }
}

function openVideoModal(youtubeId) {
  const modalBackdrop = document.getElementById('modal-backdrop');
  const body = document.getElementById('modal-body');
  if (!modalBackdrop || !body) return;

  body.innerHTML = `
    <h3 style="margin-bottom: 1rem; color: var(--accent-gold);">Bibek Gosht Lecture — Naad Pargass</h3>
    <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px;">
      <iframe src="https://www.youtube.com/embed/${youtubeId}?autoplay=1" 
              title="YouTube Video Player" 
              style="position: absolute; top:0; left:0; width:100%; height:100%; border:0;" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen>
      </iframe>
    </div>
  `;

  modalBackdrop.classList.add('open');
}

// Counter Animations for Hero
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    let count = 0;
    const increment = target / 30;
    const updateCount = () => {
      count += increment;
      if (count < target) {
        counter.innerText = Math.ceil(count) + '+';
        setTimeout(updateCount, 40);
      } else {
        counter.innerText = target + '+';
      }
    };
    updateCount();
  });
}
