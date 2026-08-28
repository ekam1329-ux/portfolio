import { getStoredData, saveStoredData, defaultCvData } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
  initAdminAuth();
  initAdminTabs();
  setupThemeToggle();
});

const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'ekamsingh2026#admin';

function getAdminPassword() {
  return localStorage.getItem('admin_password') || DEFAULT_PASSWORD;
}

function initAdminAuth() {
  const loginForm = document.getElementById('admin-login-form');
  const loginError = document.getElementById('login-error');
  const authContainer = document.getElementById('admin-auth-container');
  const dashboardContainer = document.getElementById('admin-dashboard-container');
  const logoutBtn = document.getElementById('admin-logout-btn');

  if (sessionStorage.getItem('admin_authenticated') === 'true') {
    if (authContainer) authContainer.style.display = 'none';
    if (dashboardContainer) dashboardContainer.style.display = 'block';
    loadDashboardData();
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('admin-username').value.trim();
      const pass = document.getElementById('admin-password').value;

      if (user === DEFAULT_USERNAME && pass === getAdminPassword()) {
        sessionStorage.setItem('admin_authenticated', 'true');
        if (authContainer) authContainer.style.display = 'none';
        if (dashboardContainer) dashboardContainer.style.display = 'block';
        loadDashboardData();
      } else {
        if (loginError) loginError.innerText = 'Invalid credentials. Try again.';
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('admin_authenticated');
      window.location.reload();
    });
  }
}

function initAdminTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.getAttribute('data-tab');
      document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.classList.remove('active');
      });

      const activeContent = document.getElementById(`tab-${target}`);
      if (activeContent) activeContent.classList.add('active');
    });
  });
}

function loadDashboardData() {
  const data = getStoredData();
  renderInboxMessages();
  renderPersonalForm(data);
  renderPublicationsAdmin(data);
  renderResearchAdmin(data);
  renderTalksAdmin(data);
  renderJourneyAdmin(data);
  renderConferencesAdmin(data);
  setupSettingsAndReset();
  setupModalListeners();
}

// 1. INBOX MESSAGES
function renderInboxMessages() {
  const listContainer = document.getElementById('messages-list-container');
  const badge = document.getElementById('unread-count-badge');
  if (!listContainer) return;

  const messages = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
  if (badge) badge.innerText = messages.length;

  if (messages.length === 0) {
    listContainer.innerHTML = `
      <div class="glass-card" style="text-align: center; color: var(--text-muted); padding: 3rem;">
        <h3>No Messages Received Yet</h3>
        <p>Submitted contact forms from index.html will automatically appear here.</p>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = messages.map((msg, idx) => `
    <div class="glass-card message-item-card" style="margin-bottom: 1.25rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
        <div>
          <h3 style="font-size: 1.2rem; color: var(--accent-gold);">${msg.subject || 'No Subject'}</h3>
          <div style="font-size: 0.9rem; color: var(--text-primary); font-weight: 600;">
            From: ${msg.name} (&lt;${msg.email}&gt;)
          </div>
        </div>
        <span style="font-size: 0.8rem; color: var(--text-muted);">${msg.date || 'Recent'}</span>
      </div>
      <p style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px; font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 1rem;">
        ${msg.message}
      </p>
      <button class="btn btn-small btn-outline delete-msg-btn" data-index="${idx}">Delete Message</button>
    </div>
  `).join('');

  document.querySelectorAll('.delete-msg-btn').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      messages.splice(idx, 1);
      localStorage.setItem('portfolio_messages', JSON.stringify(messages));
      renderInboxMessages();
    };
  });

  const clearBtn = document.getElementById('clear-messages-btn');
  if (clearBtn) {
    clearBtn.onclick = () => {
      if (confirm('Clear all inbox messages?')) {
        localStorage.removeItem('portfolio_messages');
        renderInboxMessages();
      }
    };
  }
}

// 2. PERSONAL & BIO FORM
function renderPersonalForm(data) {
  const p = data.personal || {};
  const form = document.getElementById('edit-personal-form');
  const status = document.getElementById('personal-save-status');
  if (!form) return;

  document.getElementById('p-name').value = p.name || '';
  document.getElementById('p-title').value = p.title || '';
  document.getElementById('p-tagline').value = p.tagline || '';
  document.getElementById('p-qualifications').value = p.qualifications || '';
  document.getElementById('p-bio1').value = p.bioP1 || '';
  document.getElementById('p-bio2').value = p.bioP2 || '';
  document.getElementById('p-quote').value = p.quote || '';
  document.getElementById('p-email').value = p.email || '';
  document.getElementById('p-phone').value = p.phone || '';
  document.getElementById('p-location').value = p.location || '';

  form.onsubmit = (e) => {
    e.preventDefault();
    p.name = document.getElementById('p-name').value;
    p.title = document.getElementById('p-title').value;
    p.tagline = document.getElementById('p-tagline').value;
    p.qualifications = document.getElementById('p-qualifications').value;
    p.bioP1 = document.getElementById('p-bio1').value;
    p.bioP2 = document.getElementById('p-bio2').value;
    p.quote = document.getElementById('p-quote').value;
    p.email = document.getElementById('p-email').value;
    p.phone = document.getElementById('p-phone').value;
    p.location = document.getElementById('p-location').value;

    data.personal = p;
    saveStoredData(data);

    status.style.color = 'var(--accent-emerald)';
    status.innerText = 'Personal details & Bio updated successfully!';
  };
}

// 3. PUBLICATIONS CRUD (WITH EDIT DETAILS)
function renderPublicationsAdmin(data) {
  const container = document.getElementById('publications-admin-list');
  if (!container) return;

  const list = data.publications || [];
  container.innerHTML = list.map((pub, idx) => `
    <div class="glass-card" style="margin-bottom: 1.25rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <span class="pub-tag">${pub.type}</span>
          <h3 style="color: var(--accent-gold); font-size: 1.3rem; margin: 0.5rem 0;">${pub.title}</h3>
          <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
            <strong>Journal:</strong> ${pub.journal} | <strong>Date:</strong> ${pub.date} | <strong>Publisher:</strong> ${pub.publisher}
          </div>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1rem;">${pub.abstract}</p>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-small btn-primary edit-pub-btn" data-index="${idx}">✏️ Edit Details</button>
          <button class="btn btn-small btn-outline remove-pub-btn" data-index="${idx}">🗑️ Delete</button>
        </div>
      </div>
      <a href="${pub.link}" target="_blank" class="btn btn-small btn-glass">Link: ${pub.link} ↗</a>
    </div>
  `).join('');

  // EDIT PUBLICATION
  document.querySelectorAll('.edit-pub-btn').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      const item = list[idx];

      openDynamicModal('Edit Publication Details', [
        { label: 'Title', id: 'pub_title', type: 'text', required: true, default: item.title },
        { label: 'Publication Type', id: 'pub_type', type: 'text', default: item.type },
        { label: 'Journal / Volume', id: 'pub_journal', type: 'text', required: true, default: item.journal },
        { label: 'Date', id: 'pub_date', type: 'text', required: true, default: item.date },
        { label: 'Publisher / Location', id: 'pub_publisher', type: 'text', required: true, default: item.publisher },
        { label: 'Flipbook / Article Link', id: 'pub_link', type: 'url', required: true, default: item.link },
        { label: 'Abstract / Summary', id: 'pub_abstract', type: 'textarea', required: true, default: item.abstract }
      ], (formData) => {
        list[idx] = {
          ...item,
          title: formData.pub_title,
          type: formData.pub_type,
          journal: formData.pub_journal,
          date: formData.pub_date,
          publisher: formData.pub_publisher,
          link: formData.pub_link,
          abstract: formData.pub_abstract
        };
        data.publications = list;
        saveStoredData(data);
        renderPublicationsAdmin(data);
      });
    };
  });

  // DELETE PUBLICATION
  document.querySelectorAll('.remove-pub-btn').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      if (confirm('Delete this publication?')) {
        list.splice(idx, 1);
        data.publications = list;
        saveStoredData(data);
        renderPublicationsAdmin(data);
      }
    };
  });

  // ADD NEW PUBLICATION
  const addBtn = document.getElementById('add-pub-modal-btn');
  if (addBtn) {
    addBtn.onclick = () => {
      openDynamicModal('Add New Publication', [
        { label: 'Title', id: 'pub_title', type: 'text', required: true },
        { label: 'Publication Type', id: 'pub_type', type: 'text', default: 'Research Article' },
        { label: 'Journal / Volume', id: 'pub_journal', type: 'text', required: true },
        { label: 'Date', id: 'pub_date', type: 'text', required: true },
        { label: 'Publisher / Location', id: 'pub_publisher', type: 'text', required: true },
        { label: 'Flipbook / Article URL', id: 'pub_link', type: 'url', required: true },
        { label: 'Abstract / Summary', id: 'pub_abstract', type: 'textarea', required: true }
      ], (formData) => {
        data.publications.push({
          id: 'pub-' + Date.now(),
          title: formData.pub_title,
          type: formData.pub_type,
          journal: formData.pub_journal,
          date: formData.pub_date,
          publisher: formData.pub_publisher,
          link: formData.pub_link,
          abstract: formData.pub_abstract
        });
        saveStoredData(data);
        renderPublicationsAdmin(data);
      });
    };
  }
}

// 4. RESEARCH FOCUS CRUD (WITH EDIT DETAILS)
function renderResearchAdmin(data) {
  const container = document.getElementById('research-admin-list');
  if (!container) return;

  const list = data.researchInterests || [];
  container.innerHTML = list.map((res, idx) => `
    <div class="glass-card" style="margin-bottom: 1.25rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <span style="font-size: 1.8rem; font-weight: 700; color: var(--accent-gold);">${res.highlightNumber}</span>
          <h3 style="font-size: 1.2rem; margin: 0.4rem 0;">${res.title}</h3>
          <p style="font-size: 0.9rem; color: var(--text-secondary);">${res.description}</p>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-small btn-primary edit-res-btn" data-index="${idx}">✏️ Edit Details</button>
          <button class="btn btn-small btn-outline remove-res-btn" data-index="${idx}">🗑️ Delete</button>
        </div>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.edit-res-btn').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      const item = list[idx];

      openDynamicModal('Edit Research Topic Details', [
        { label: 'Topic Title', id: 'res_title', type: 'text', required: true, default: item.title },
        { label: 'Highlight Symbol (e.g. 1, 8, 40)', id: 'res_num', type: 'text', required: true, default: item.highlightNumber },
        { label: 'Description', id: 'res_desc', type: 'textarea', required: true, default: item.description }
      ], (formData) => {
        list[idx] = {
          ...item,
          title: formData.res_title,
          highlightNumber: formData.res_num,
          description: formData.res_desc
        };
        data.researchInterests = list;
        saveStoredData(data);
        renderResearchAdmin(data);
      });
    };
  });

  document.querySelectorAll('.remove-res-btn').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      list.splice(idx, 1);
      data.researchInterests = list;
      saveStoredData(data);
      renderResearchAdmin(data);
    };
  });

  const addBtn = document.getElementById('add-research-modal-btn');
  if (addBtn) {
    addBtn.onclick = () => {
      openDynamicModal('Add Research Topic', [
        { label: 'Topic Title', id: 'res_title', type: 'text', required: true },
        { label: 'Highlight Symbol (e.g. 1, 8, 40)', id: 'res_num', type: 'text', required: true },
        { label: 'Description', id: 'res_desc', type: 'textarea', required: true }
      ], (formData) => {
        data.researchInterests.push({
          id: 'res-' + Date.now(),
          title: formData.res_title,
          highlightNumber: formData.res_num,
          description: formData.res_desc
        });
        saveStoredData(data);
        renderResearchAdmin(data);
      });
    };
  }
}

// 5. TALKS CRUD (WITH EDIT DETAILS)
function renderTalksAdmin(data) {
  const container = document.getElementById('talks-admin-list');
  if (!container) return;

  const list = data.talks || [];
  container.innerHTML = list.map((talk, idx) => `
    <div class="glass-card" style="margin-bottom: 1.25rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <span class="section-tag">${talk.event}</span>
          <h3 style="color: var(--accent-gold); font-size: 1.3rem; margin: 0.4rem 0;">${talk.title}</h3>
          <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
            📍 ${talk.location} (${talk.date}) | YouTube ID: <strong>${talk.youtubeId}</strong>
          </div>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.75rem;">${talk.description}</p>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-small btn-primary edit-talk-btn" data-index="${idx}">✏️ Edit Details</button>
          <button class="btn btn-small btn-outline remove-talk-btn" data-index="${idx}">🗑️ Delete</button>
        </div>
      </div>
      <a href="${talk.link}" target="_blank" class="btn btn-small btn-glass">Link: ${talk.link} ↗</a>
    </div>
  `).join('');

  document.querySelectorAll('.edit-talk-btn').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      const item = list[idx];

      openDynamicModal('Edit Talk / Lecture Details', [
        { label: 'Lecture Title', id: 'talk_title', type: 'text', required: true, default: item.title },
        { label: 'Event Series', id: 'talk_event', type: 'text', required: true, default: item.event },
        { label: 'Date', id: 'talk_date', type: 'text', required: true, default: item.date },
        { label: 'Location', id: 'talk_loc', type: 'text', required: true, default: item.location },
        { label: 'YouTube Video ID', id: 'talk_yt', type: 'text', required: true, default: item.youtubeId },
        { label: 'YouTube Link', id: 'talk_link', type: 'url', required: true, default: item.link },
        { label: 'Description', id: 'talk_desc', type: 'textarea', required: true, default: item.description }
      ], (formData) => {
        list[idx] = {
          ...item,
          title: formData.talk_title,
          event: formData.talk_event,
          date: formData.talk_date,
          location: formData.talk_loc,
          youtubeId: formData.talk_yt,
          link: formData.talk_link,
          description: formData.talk_desc
        };
        data.talks = list;
        saveStoredData(data);
        renderTalksAdmin(data);
      });
    };
  });

  document.querySelectorAll('.remove-talk-btn').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      list.splice(idx, 1);
      data.talks = list;
      saveStoredData(data);
      renderTalksAdmin(data);
    };
  });

  const addBtn = document.getElementById('add-talk-modal-btn');
  if (addBtn) {
    addBtn.onclick = () => {
      openDynamicModal('Add Talk / Lecture Video', [
        { label: 'Lecture Title', id: 'talk_title', type: 'text', required: true },
        { label: 'Event Series', id: 'talk_event', type: 'text', required: true },
        { label: 'Date', id: 'talk_date', type: 'text', required: true },
        { label: 'Location', id: 'talk_loc', type: 'text', required: true },
        { label: 'YouTube Video ID (e.g. E8isUpse27s)', id: 'talk_yt', type: 'text', required: true },
        { label: 'Full YouTube Link', id: 'talk_link', type: 'url', required: true },
        { label: 'Lecture Description', id: 'talk_desc', type: 'textarea', required: true }
      ], (formData) => {
        data.talks.push({
          id: 'talk-' + Date.now(),
          title: formData.talk_title,
          event: formData.talk_event,
          date: formData.talk_date,
          location: formData.talk_loc,
          youtubeId: formData.talk_yt,
          link: formData.talk_link,
          description: formData.talk_desc
        });
        saveStoredData(data);
        renderTalksAdmin(data);
      });
    };
  }
}

// 6. ACADEMIC JOURNEY CRUD (WITH EDIT DETAILS)
function renderJourneyAdmin(data) {
  const container = document.getElementById('journey-admin-list');
  if (!container) return;

  const eduList = data.education || [];
  const expList = data.experience || [];

  container.innerHTML = `
    <h3 style="color: var(--accent-gold); margin-bottom: 1rem;">Education & Qualifications</h3>
    ${eduList.map((edu, idx) => `
      <div class="glass-card" style="margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <span class="pub-tag">${edu.badge}</span>
            <h4 style="font-size: 1.15rem; margin: 0.3rem 0;">${edu.degree} (${edu.field})</h4>
            <div style="font-size: 0.85rem; color: var(--text-secondary);">${edu.institution} • ${edu.year}</div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.4rem;">${edu.details}</p>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-small btn-primary edit-edu-btn" data-index="${idx}">✏️ Edit</button>
            <button class="btn btn-small btn-outline remove-edu-btn" data-index="${idx}">🗑️ Delete</button>
          </div>
        </div>
      </div>
    `).join('')}

    <h3 style="color: var(--accent-gold); margin: 2rem 0 1rem 0;">Faculty & Teaching Experience</h3>
    ${expList.map((exp, idx) => `
      <div class="glass-card" style="margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h4 style="font-size: 1.15rem; margin-bottom: 0.3rem;">${exp.role}</h4>
            <div style="font-size: 0.85rem; color: var(--text-secondary);">${exp.institution}, ${exp.location} (${exp.period})</div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.4rem;">${exp.responsibilities}</p>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-small btn-primary edit-exp-btn" data-index="${idx}">✏️ Edit</button>
            <button class="btn btn-small btn-outline remove-exp-btn" data-index="${idx}">🗑️ Delete</button>
          </div>
        </div>
      </div>
    `).join('')}
  `;

  document.querySelectorAll('.edit-edu-btn').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      const item = eduList[idx];

      openDynamicModal('Edit Degree / Qualification Details', [
        { label: 'Degree / Title', id: 'j_degree', type: 'text', required: true, default: item.degree },
        { label: 'Field / Subject', id: 'j_field', type: 'text', required: true, default: item.field },
        { label: 'Institution / University', id: 'j_inst', type: 'text', required: true, default: item.institution },
        { label: 'Year / Period', id: 'j_year', type: 'text', required: true, default: item.year },
        { label: 'Honor Badge', id: 'j_badge', type: 'text', required: true, default: item.badge },
        { label: 'Details / Description', id: 'j_details', type: 'textarea', required: true, default: item.details }
      ], (formData) => {
        eduList[idx] = {
          ...item,
          degree: formData.j_degree,
          field: formData.j_field,
          institution: formData.j_inst,
          year: formData.j_year,
          badge: formData.j_badge,
          details: formData.j_details
        };
        data.education = eduList;
        saveStoredData(data);
        renderJourneyAdmin(data);
      });
    };
  });

  document.querySelectorAll('.remove-edu-btn').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      eduList.splice(idx, 1);
      data.education = eduList;
      saveStoredData(data);
      renderJourneyAdmin(data);
    };
  });

  document.querySelectorAll('.remove-exp-btn').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      expList.splice(idx, 1);
      data.experience = expList;
      saveStoredData(data);
      renderJourneyAdmin(data);
    };
  });

  const addBtn = document.getElementById('add-journey-modal-btn');
  if (addBtn) {
    addBtn.onclick = () => {
      openDynamicModal('Add Degree / Qualification', [
        { label: 'Degree / Title', id: 'j_degree', type: 'text', required: true },
        { label: 'Field / Subject', id: 'j_field', type: 'text', required: true },
        { label: 'Institution / University', id: 'j_inst', type: 'text', required: true },
        { label: 'Year / Period', id: 'j_year', type: 'text', required: true },
        { label: 'Honor Badge (e.g. First Division with Distinction)', id: 'j_badge', type: 'text', required: true },
        { label: 'Details / Description', id: 'j_details', type: 'textarea', required: true }
      ], (formData) => {
        data.education.push({
          id: 'edu-' + Date.now(),
          degree: formData.j_degree,
          field: formData.j_field,
          institution: formData.j_inst,
          year: formData.j_year,
          badge: formData.j_badge,
          details: formData.j_details
        });
        saveStoredData(data);
        renderJourneyAdmin(data);
      });
    };
  }
}

// 7. CONFERENCES CRUD (WITH EDIT DETAILS)
function renderConferencesAdmin(data) {
  const container = document.getElementById('conferences-admin-list');
  if (!container) return;

  const list = data.conferences || [];
  container.innerHTML = list.map((conf, idx) => `
    <div class="glass-card" style="margin-bottom: 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <span class="conf-type">${conf.type} • ${conf.year}</span>
          <h4 style="font-size: 1.1rem; margin: 0.3rem 0;">${conf.title}</h4>
          <div style="font-size: 0.85rem; color: var(--text-secondary);">🏛️ ${conf.organizer}</div>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-small btn-primary edit-conf-btn" data-index="${idx}">✏️ Edit</button>
          <button class="btn btn-small btn-outline remove-conf-btn" data-index="${idx}">🗑️ Delete</button>
        </div>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.edit-conf-btn').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      const item = list[idx];

      openDynamicModal('Edit Conference Details', [
        { label: 'Event Title', id: 'c_title', type: 'text', required: true, default: item.title },
        { label: 'Year', id: 'c_year', type: 'text', required: true, default: item.year },
        { label: 'Event Type', id: 'c_type', type: 'text', required: true, default: item.type },
        { label: 'Organizer / Institution', id: 'c_org', type: 'text', required: true, default: item.organizer }
      ], (formData) => {
        list[idx] = {
          ...item,
          title: formData.c_title,
          year: formData.c_year,
          type: formData.c_type,
          organizer: formData.c_org
        };
        data.conferences = list;
        saveStoredData(data);
        renderConferencesAdmin(data);
      });
    };
  });

  document.querySelectorAll('.remove-conf-btn').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      list.splice(idx, 1);
      data.conferences = list;
      saveStoredData(data);
      renderConferencesAdmin(data);
    };
  });

  const addBtn = document.getElementById('add-conf-modal-btn');
  if (addBtn) {
    addBtn.onclick = () => {
      openDynamicModal('Add Conference / Webinar', [
        { label: 'Event Title', id: 'c_title', type: 'text', required: true },
        { label: 'Year', id: 'c_year', type: 'text', required: true },
        { label: 'Event Type (e.g. International Webinar)', id: 'c_type', type: 'text', required: true },
        { label: 'Organizer / Institution', id: 'c_org', type: 'text', required: true }
      ], (formData) => {
        data.conferences.push({
          id: 'conf-' + Date.now(),
          title: formData.c_title,
          year: formData.c_year,
          type: formData.c_type,
          organizer: formData.c_org
        });
        saveStoredData(data);
        renderConferencesAdmin(data);
      });
    };
  }
}

// 8. SETTINGS & RESET
function setupSettingsAndReset() {
  const form = document.getElementById('change-password-form');
  const status = document.getElementById('password-status');
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const curr = document.getElementById('current-pass').value;
      const newP = document.getElementById('new-pass').value;

      if (curr !== getAdminPassword()) {
        status.style.color = '#ef4444';
        status.innerText = 'Current password incorrect.';
        return;
      }

      localStorage.setItem('admin_password', newP);
      status.style.color = 'var(--accent-emerald)';
      status.innerText = 'Admin password updated successfully!';
      form.reset();
    };
  }

  const resetBtn = document.getElementById('reset-data-btn');
  if (resetBtn) {
    resetBtn.onclick = () => {
      if (confirm('Are you sure you want to reset all portfolio data to default CV content?')) {
        saveStoredData(defaultCvData);
        alert('Portfolio data reset to default successfully!');
        window.location.reload();
      }
    };
  }
}

// DYNAMIC MODAL GENERATOR
function openDynamicModal(title, fields, onSubmit) {
  const modal = document.getElementById('admin-editor-modal');
  const titleElem = document.getElementById('admin-modal-title');
  const fieldsElem = document.getElementById('admin-form-fields');
  const form = document.getElementById('admin-dynamic-form');

  if (!modal || !fieldsElem || !form) return;

  titleElem.innerText = title;
  fieldsElem.innerHTML = fields.map(f => `
    <div class="form-group" style="margin-bottom: 1rem;">
      <label for="${f.id}">${f.label}</label>
      ${f.type === 'textarea' 
        ? `<textarea id="${f.id}" rows="3" ${f.required ? 'required' : ''}>${f.default || ''}</textarea>`
        : `<input type="${f.type}" id="${f.id}" value="${f.default || ''}" ${f.required ? 'required' : ''}>`
      }
    </div>
  `).join('');

  modal.classList.add('open');

  form.onsubmit = (e) => {
    e.preventDefault();
    const result = {};
    fields.forEach(f => {
      result[f.id] = document.getElementById(f.id).value;
    });
    onSubmit(result);
    modal.classList.remove('open');
  };
}

function setupModalListeners() {
  const modal = document.getElementById('admin-editor-modal');
  const closeBtn = document.getElementById('admin-modal-close');
  if (closeBtn && modal) {
    closeBtn.onclick = () => modal.classList.remove('open');
  }
}

function setupThemeToggle() {
  const btn = document.getElementById('admin-theme-toggle');
  const icon = document.getElementById('admin-theme-icon');
  const text = document.getElementById('admin-theme-text');

  const saved = localStorage.getItem('theme') || 'dark';
  if (saved === 'light') {
    document.body.classList.add('light-theme');
    if (icon) icon.innerText = '☀️';
    if (text) text.innerText = 'Bright';
  }

  if (btn) {
    btn.onclick = () => {
      const isDark = !document.body.classList.contains('light-theme');
      if (isDark) {
        document.body.classList.add('light-theme');
        if (icon) icon.innerText = '☀️';
        if (text) text.innerText = 'Bright';
        localStorage.setItem('theme', 'light');
      } else {
        document.body.classList.remove('light-theme');
        if (icon) icon.innerText = '🌙';
        if (text) text.innerText = 'Dark';
        localStorage.setItem('theme', 'dark');
      }
    };
  }
}
