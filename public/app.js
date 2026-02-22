// ============================================
// DOM Elements
// ============================================

// Auth Elements
const authScreen = document.getElementById('auth-screen');
const mainScreen = document.getElementById('main-screen');
const authForm = document.getElementById('auth-form');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const authError = document.getElementById('auth-error');
const logoutBtn = document.getElementById('logout-btn');
const userEmailDisplay = document.getElementById('user-email-display');

// Tab Elements
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Idea Form Elements
const ideaForm = document.getElementById('idea-form');
const ideaEmail = document.getElementById('idea-email');
const ideaProblem = document.getElementById('idea-problem');
const ideaBillion = document.getElementById('idea-billion');
const submitIdeaBtn = document.getElementById('submit-idea-btn');
const ideaSuccess = document.getElementById('idea-success');
const submitAnotherIdea = document.getElementById('submit-another-idea');

// Dashboard Elements
const refreshDashboardBtn = document.getElementById('refresh-dashboard');
const ideasLoading = document.getElementById('ideas-loading');
const ideasEmpty = document.getElementById('ideas-empty');
const ideasList = document.getElementById('ideas-list');
const ideasCount = document.getElementById('ideas-count');

// Email Dashboard Elements
const emailCount = document.getElementById('email-count');
const downloadEmailsCsvBtn = document.getElementById('download-emails-csv');
const emailsLoading = document.getElementById('emails-loading');
const emailsEmpty = document.getElementById('emails-empty');
const emailsList = document.getElementById('emails-list');

// ============================================
// State
// ============================================
let authPassword = null;
let authEmail = null;
let accessLevel = null; // 'admin' or 'public'

// ============================================
// Constants
// ============================================
const API_BASE = '/api';
const IDEA_SUBMITTED_KEY = 'n8nautomations_idea_submitted';
const GATED_TABS = ['automations'];

// ============================================
// Automations Configuration
// ============================================
const AUTOMATIONS = [
  {
    id: 'job-search-ultimate',
    day: 1,
    date: 'Feb 22, 2026',
    icon: '🔍',
    title: 'Job Search Ultimate Workflow',
    shortDesc: 'Automated daily job search: resume parsing, LinkedIn matching, AI scoring, cover letter generation, and email summary.',
    tags: ['LinkedIn', 'Google Gemini', 'Gmail', 'Google Sheets'],
    difficulty: 'Intermediate',
    estimatedSetup: '30 min',
    jsonFile: '/automations/job-search-workflow.json',
    linkedinUrl: 'https://www.linkedin.com/posts/akhil-reddy-danda-1a74b214b_resume-personalise-n8n-activity-7431095739637829633-Keog?utm_source=share&utm_medium=member_desktop&rcm=ACoAACQz6Y8BJnaLIxebO1oXTo0ei3-1-d4gJqs',
    linkedinPost: `I applied to over 2000 jobs last year, and all I got were rejections, until I changed this one thing.

You see, clearing interviews is not just about mass applying to every role you find, you must have heard people say it a 100 times that you need to cater your resume to the exact role you are applying for, not just make it "ATS friendly".

ATS is just a tool which a lot of companies have already denied that they use it to select candidates. Having worked at multiple companies that use ATS systems, it just means to track candidates, extract their information and nothing more.

But catering your resume to each and every role takes up a lot of time, time that you potentially do not have while juggling a lot of different things in university or at work.

I created this n8n workflow a few days ago that will help you automate this entire process end to end, and make your resume the best that the recruiter has ever seen.

1. It runs every morning at 5 AM, so you do not need to worry anymore.
2. Extracts information from your resume
3. Finds role basis on the resume and filters you enter that were posted in the last 24 hours
4. Adds everything from the link, a cover letter and also exact improvements that you can make on your resume
5. Puts everything onto a Google sheet and sends you an e-mail once it is done.

If I had something like this when I was applying I would have saved soo much time and energy by not manually going through each and every job description and catering my resume to that role.

#n8n #automation #jobsearch #AI #productivity`,
    workflowNodes: [
      { name: 'Schedule Trigger', type: 'trigger' },
      { name: 'Download File', type: 'normal' },
      { name: 'Extract from PDF', type: 'normal' },
      { name: 'Get Sheet Rows', type: 'normal' },
      { name: 'LinkedIn Search', type: 'normal' },
      { name: 'Fetch Jobs', type: 'normal' },
      { name: 'Parse HTML', type: 'normal' },
      { name: 'Split Out', type: 'normal' },
      { name: 'Wait', type: 'normal' },
      { name: 'HTTP Request', type: 'normal' },
      { name: 'Edit Fields', type: 'normal' },
      { name: 'AI Agent (Gemini)', type: 'ai' },
      { name: 'Edit Fields', type: 'normal' },
      { name: 'AI Agent (Gemini)', type: 'ai' },
      { name: 'Append to Sheet', type: 'output' },
      { name: 'Loop Over Items', type: 'normal' },
      { name: 'Send Email (Gmail)', type: 'output' }
    ],
    credentials: [
      { icon: '🤖', name: 'Google Gemini API Key', desc: 'For AI job scoring and cover letter generation (free tier: 60 req/min)' },
      { icon: '📊', name: 'Google Sheets OAuth', desc: 'To read/write your job tracking spreadsheet' },
      { icon: '📧', name: 'Gmail OAuth', desc: 'To send daily job match email summaries' }
    ],
    setupSteps: [
      'Install n8n locally (npx n8n) or use n8n Cloud (free tier available)',
      'Download the workflow JSON from below and import it in n8n (Settings > Import from File)',
      'Set up a Google Cloud project and enable the Gemini API — get your API key from Google AI Studio (ai.google.dev)',
      'Create a Google Sheet with columns: Job Title, Company, URL, Match Score, Cover Letter, Resume Tips, Date',
      'Configure Google Sheets and Gmail OAuth credentials in n8n (follow n8n docs for Google OAuth setup)',
      'Upload your resume PDF to a publicly accessible URL (Google Drive, Dropbox, etc.)',
      'Update the "Download File" node with your resume PDF URL',
      'Update the "LinkedIn Search" node with your job search keywords, location, and filters',
      'Set the Schedule Trigger to your preferred time (default: 5 AM daily)',
      'Activate the workflow and let it run! Check your Google Sheet and email each morning.'
    ]
  }
];

// ============================================
// Utility Functions
// ============================================
function showElement(el) {
  if (el) el.classList.remove('hidden');
}

function hideElement(el) {
  if (el) el.classList.add('hidden');
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// ============================================
// Tab Gating (idea submission required)
// ============================================
function hasSubmittedIdea() {
  return localStorage.getItem(IDEA_SUBMITTED_KEY) === 'true';
}

function markIdeaSubmitted() {
  localStorage.setItem(IDEA_SUBMITTED_KEY, 'true');
}

function isTabUnlocked(tabName) {
  if (accessLevel === 'admin') return true;
  if (!GATED_TABS.includes(tabName)) return true;
  return hasSubmittedIdea();
}

function updateTabAccess() {
  const unlocked = accessLevel === 'admin' || hasSubmittedIdea();
  tabButtons.forEach(btn => {
    const tab = btn.dataset.tab;
    if (!tab || !GATED_TABS.includes(tab)) return;

    if (unlocked) {
      btn.classList.remove('tab-locked');
      btn.removeAttribute('title');
    } else {
      btn.classList.add('tab-locked');
      btn.setAttribute('title', 'Submit an idea first to unlock');
    }
  });
}

// ============================================
// Tab Navigation
// ============================================
function switchTab(tabName) {
  // Check if tab is locked
  if (!isTabUnlocked(tabName)) {
    showLockedMessage();
    return;
  }

  // Update buttons
  tabButtons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.tab === tabName) {
      btn.classList.add('active');
    }
  });

  // Update content
  tabContents.forEach(content => {
    content.classList.remove('active');
    hideElement(content);
  });

  const activeContent = document.getElementById(`tab-${tabName}`);
  if (activeContent) {
    activeContent.classList.add('active');
    showElement(activeContent);
  }

  // Load dashboard data if switching to dashboard
  if (tabName === 'dashboard' && accessLevel === 'admin') {
    loadEmails();
    loadIdeas();
  }

  // Render automations grid if switching to automations tab
  if (tabName === 'automations') {
    renderAutomationsGrid();
  }
}

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.dataset.tab;
    if (tabName) {
      if (!isTabUnlocked(tabName)) {
        showLockedMessage();
        return;
      }
      switchTab(tabName);
    }
  });
});

function showLockedMessage() {
  const existing = document.getElementById('locked-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'locked-toast';
  toast.className = 'locked-toast';
  toast.innerHTML = '🔒 Submit an idea first to unlock this section!';
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ============================================
// Authentication
// ============================================
const ADMIN_EMAIL = 'akhilreddydanda3@gmail.com';
const adminPasswordGroup = document.getElementById('admin-password-group');

// Show password field when admin email is typed
if (emailInput) {
  emailInput.addEventListener('input', () => {
    const isAdmin = emailInput.value.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
    if (isAdmin) {
      showElement(adminPasswordGroup);
    } else {
      hideElement(adminPasswordGroup);
      if (passwordInput) passwordInput.value = '';
    }
  });
}

authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput ? passwordInput.value.trim() : '';

  if (!email) {
    authError.textContent = 'Please enter your email';
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      authPassword = password;
      authEmail = data.email || email;
      accessLevel = data.accessLevel || 'public';

      hideElement(authScreen);
      showElement(mainScreen);
      showElement(logoutBtn);
      authError.textContent = '';

      // Display user email
      if (userEmailDisplay) {
        userEmailDisplay.textContent = authEmail;
      }

      // Pre-fill idea email with login email
      if (ideaEmail) {
        ideaEmail.value = authEmail;
      }

      // Show admin-only elements
      if (accessLevel === 'admin') {
        document.querySelectorAll('.admin-only').forEach(el => {
          el.classList.remove('hidden');
        });
      }

      updateTabAccess();
    } else {
      authError.textContent = data.error || 'Please enter a valid email address';
      if (passwordInput) passwordInput.value = '';
    }
  } catch (error) {
    authError.textContent = 'Connection error. Please try again.';
    console.error('Auth error:', error);
  }
});

// ============================================
// Logout
// ============================================
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    // Clear state
    authPassword = null;
    authEmail = null;
    accessLevel = null;
    localStorage.removeItem(IDEA_SUBMITTED_KEY);

    // Reset UI
    hideElement(mainScreen);
    hideElement(logoutBtn);
    showElement(authScreen);

    // Clear form inputs
    if (emailInput) emailInput.value = '';
    if (passwordInput) passwordInput.value = '';
    if (authError) authError.textContent = '';

    // Hide admin elements
    document.querySelectorAll('.admin-only').forEach(el => {
      el.classList.add('hidden');
    });

    // Reset to first tab
    switchTab('ideas');

    // Reset idea form
    if (ideaForm) ideaForm.reset();
    hideElement(ideaSuccess);
    showElement(ideaForm);
  });
}

// ============================================
// Idea Submission
// ============================================
ideaForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const idea = {
    email: ideaEmail.value.trim(),
    problem: ideaProblem.value.trim(),
    billion: ideaBillion.value.trim()
  };

  // Validate
  if (!idea.email || !idea.problem || !idea.billion) {
    alert('Please fill in all required fields');
    return;
  }
  if (idea.problem.split(/\s+/).length < 5) {
    alert('Please write at least 5 words for the automation request');
    return;
  }
  if (idea.billion.split(/\s+/).length < 5) {
    alert('Please write at least 5 words for the billion-dollar idea');
    return;
  }

  submitIdeaBtn.disabled = true;
  submitIdeaBtn.textContent = 'Submitting...';

  try {
    const response = await fetch(`${API_BASE}/submit-idea`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Upload-Password': authPassword
      },
      body: JSON.stringify(idea)
    });

    const data = await response.json();

    if (response.ok && data.success) {
      hideElement(ideaForm);
      showElement(ideaSuccess);

      // Unlock gated tabs
      markIdeaSubmitted();
      updateTabAccess();
    } else {
      alert(data.error || 'Failed to submit idea. Please try again.');
    }
  } catch (error) {
    console.error('Submit error:', error);
    alert('Connection error. Please try again.');
  } finally {
    submitIdeaBtn.disabled = false;
    submitIdeaBtn.textContent = '🚀 Submit My Idea';
  }
});

// View Automations button (after successful idea submission)
const viewAutomationsBtn = document.getElementById('view-automations');
if (viewAutomationsBtn) {
  viewAutomationsBtn.addEventListener('click', () => {
    switchTab('automations');
  });
}

// Submit Another Idea button
if (submitAnotherIdea) {
  submitAnotherIdea.addEventListener('click', () => {
    ideaForm.reset();
    // Re-fill email
    if (ideaEmail && authEmail) {
      ideaEmail.value = authEmail;
    }
    hideElement(ideaSuccess);
    showElement(ideaForm);
  });
}

// ============================================
// Admin Dashboard
// ============================================
async function loadEmails() {
  if (accessLevel !== 'admin') return;

  showElement(emailsLoading);
  hideElement(emailsEmpty);
  hideElement(emailsList);

  try {
    const response = await fetch(`${API_BASE}/get-emails`, {
      headers: {
        'X-Upload-Password': authPassword
      }
    });

    const data = await response.json();
    hideElement(emailsLoading);

    if (response.ok && data.emails) {
      if (emailCount) emailCount.textContent = data.count || data.emails.length;

      if (data.emails.length === 0) {
        showElement(emailsEmpty);
      } else {
        renderEmails(data.emails);
        showElement(emailsList);
      }
    } else {
      emailsList.innerHTML = `<div class="error-box"><p>${data.error || 'Failed to load emails'}</p></div>`;
      showElement(emailsList);
    }
  } catch (error) {
    console.error('Load emails error:', error);
    hideElement(emailsLoading);
    emailsList.innerHTML = '<div class="error-box"><p>Connection error. Please try again.</p></div>';
    showElement(emailsList);
  }
}

function renderEmails(emails) {
  emailsList.innerHTML = `
    <table class="emails-table">
      <thead>
        <tr>
          <th>Email</th>
          <th>First Seen</th>
          <th>Last Seen</th>
          <th>Logins</th>
        </tr>
      </thead>
      <tbody>
        ${emails.map(e => `
          <tr>
            <td class="email-cell">${escapeHtml(e.email)}</td>
            <td>${formatDate(e.firstSeen)}</td>
            <td>${formatDate(e.lastSeen)}</td>
            <td>${e.loginCount}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function downloadEmailsCsv() {
  fetch(`${API_BASE}/get-emails`, {
    headers: { 'X-Upload-Password': authPassword }
  })
  .then(res => res.json())
  .then(data => {
    if (!data.emails || data.emails.length === 0) {
      alert('No emails to download.');
      return;
    }
    const csvRows = ['Email,First Seen,Last Seen,Login Count'];
    data.emails.forEach(e => {
      csvRows.push(`${e.email},${e.firstSeen},${e.lastSeen},${e.loginCount}`);
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emails-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  })
  .catch(error => {
    console.error('CSV download error:', error);
    alert('Failed to download emails. Please try again.');
  });
}

if (downloadEmailsCsvBtn) {
  downloadEmailsCsvBtn.addEventListener('click', downloadEmailsCsv);
}

async function loadIdeas() {
  if (accessLevel !== 'admin') return;

  showElement(ideasLoading);
  hideElement(ideasEmpty);
  hideElement(ideasList);

  try {
    const response = await fetch(`${API_BASE}/get-ideas`, {
      headers: {
        'X-Upload-Password': authPassword
      }
    });

    const data = await response.json();

    hideElement(ideasLoading);

    if (response.ok && data.ideas) {
      if (ideasCount) ideasCount.textContent = data.ideas.length;
      if (data.ideas.length === 0) {
        showElement(ideasEmpty);
      } else {
        renderIdeas(data.ideas);
        showElement(ideasList);
      }
    } else {
      ideasList.innerHTML = `<div class="error-box"><p>${data.error || 'Failed to load ideas'}</p></div>`;
      showElement(ideasList);
    }
  } catch (error) {
    console.error('Load ideas error:', error);
    hideElement(ideasLoading);
    ideasList.innerHTML = '<div class="error-box"><p>Connection error. Please try again.</p></div>';
    showElement(ideasList);
  }
}

function renderIdeas(ideas) {
  ideasList.innerHTML = ideas.map(idea => `
    <div class="idea-card">
      <div class="idea-card-header">
        <span class="idea-card-email">${escapeHtml(idea.email)}</span>
        <span class="idea-card-date">${formatDate(idea.timestamp)}</span>
      </div>
      <div class="idea-card-section">
        <h4>🤖 Automation Request</h4>
        <p>${escapeHtml(idea.problem)}</p>
      </div>
      <div class="idea-card-section">
        <h4>🚀 Billion-Dollar Idea</h4>
        <p>${escapeHtml(idea.billion)}</p>
      </div>
    </div>
  `).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

if (refreshDashboardBtn) {
  refreshDashboardBtn.addEventListener('click', () => {
    loadEmails();
    loadIdeas();
  });
}

// ============================================
// n8n Automations Tab
// ============================================
const automationsContent = document.getElementById('automations-content');

function renderAutomationsGrid() {
  if (!automationsContent) return;

  const heroHTML = `
    <div class="automation-hero">
      <h2>🤖 n8n Automation Workflows</h2>
      <p>Ready-to-use automation workflows. Download the JSON, import into n8n, add your API keys, and go!</p>
    </div>
  `;

  const cardsHTML = AUTOMATIONS.map(a => `
    <div class="automation-card" data-automation-id="${a.id}" onclick="showAutomationDetail('${a.id}')">
      <div class="automation-card-day">Day ${a.day} — ${a.date}</div>
      <div class="automation-card-icon">${a.icon}</div>
      <div class="automation-card-title">${a.title}</div>
      <div class="automation-card-desc">${a.shortDesc}</div>
      <div class="automation-card-tags">
        ${a.tags.map(t => `<span class="automation-tag">${t}</span>`).join('')}
      </div>
      <div class="automation-card-meta">
        <span>⏱️ Setup: ${a.estimatedSetup}</span>
        <span>📊 ${a.difficulty}</span>
      </div>
      ${a.linkedinUrl ? `<a href="${a.linkedinUrl}" target="_blank" class="btn btn-linkedin" onclick="event.stopPropagation()">🔗 View on LinkedIn</a>` : ''}
    </div>
  `).join('');

  automationsContent.innerHTML = `
    ${heroHTML}
    <div class="automations-grid">${cardsHTML}</div>
  `;
}

function showAutomationDetail(automationId) {
  const automation = AUTOMATIONS.find(a => a.id === automationId);
  if (!automation || !automationsContent) return;

  const workflowNodesHTML = automation.workflowNodes.map((node, i) => {
    const arrow = i < automation.workflowNodes.length - 1
      ? '<span class="workflow-arrow">→</span>'
      : '';
    return `<span class="workflow-node ${node.type}">${node.name}</span>${arrow}`;
  }).join('');

  const credentialsHTML = automation.credentials.map(c => `
    <div class="credential-item">
      <span class="credential-icon">${c.icon}</span>
      <div>
        <div class="credential-name">${c.name}</div>
        <div class="credential-desc">${c.desc}</div>
      </div>
    </div>
  `).join('');

  const setupStepsHTML = automation.setupSteps.map(s => `<li><span>${s}</span></li>`).join('');

  automationsContent.innerHTML = `
    <div class="automation-detail">
      <button class="automation-back-btn" onclick="renderAutomationsGrid()">
        ← Back to all automations
      </button>

      <div class="automation-hero">
        <div class="automation-day-badge">Day ${automation.day} — ${automation.date}</div>
        <div style="font-size:2.5rem; margin-bottom:0.5rem;">${automation.icon}</div>
        <h2>${automation.title}</h2>
        <p>${automation.shortDesc}</p>
        ${automation.linkedinUrl ? `<a href="${automation.linkedinUrl}" target="_blank" class="btn btn-linkedin btn-large" style="margin-top:1rem;">🔗 View LinkedIn Post</a>` : ''}
      </div>

      <div class="info-card highlight">
        <h3>📋 Workflow Overview</h3>
        <div class="workflow-diagram">
          <div class="workflow-nodes">
            ${workflowNodesHTML}
          </div>
        </div>
      </div>

      <div class="automation-actions">
        <button class="btn btn-primary btn-large" onclick="downloadAutomationJSON('${automation.id}')">
          ⬇️ Download Workflow JSON
        </button>
        <button class="btn btn-outline btn-large" onclick="copyAutomationJSON('${automation.id}')">
          📋 Copy JSON to Clipboard
        </button>
      </div>
      <p id="automation-copy-feedback" class="feedback hidden" style="text-align:center;">
        Copied to clipboard!
      </p>

      <div class="info-card">
        <h3>🔑 Required Credentials</h3>
        <p style="color:var(--text-secondary); margin-bottom:1rem;">You use your own API keys — no cost to us, free tiers available for all services.</p>
        ${credentialsHTML}
      </div>

      <div class="info-card">
        <h3>🛠️ Setup Instructions</h3>
        <ol class="setup-steps">
          ${setupStepsHTML}
        </ol>
      </div>

      <div class="linkedin-post">
        <div class="linkedin-post-header">
          <div class="linkedin-post-header-left">
            <span style="font-size:1.5rem;">💼</span>
            <div>
              <div style="font-weight:600; color:var(--text-primary);">LinkedIn Post</div>
              <div class="linkedin-post-author">By Akhil Reddy | n8n Automation Series</div>
            </div>
          </div>
          <button class="linkedin-post-copy-btn" onclick="copyLinkedInPost('${automation.id}')">
            📋 Copy Post
          </button>
        </div>
        <div class="linkedin-post-body">${escapeHtml(automation.linkedinPost.replace(/#\w+/g, '').trim())}</div>
        <div class="linkedin-post-hashtags">
          ${(automation.linkedinPost.match(/#\w+/g) || []).map(h => `<span class="linkedin-hashtag">${h}</span>`).join('')}
        </div>
        <p id="linkedin-copy-feedback" class="feedback hidden" style="text-align:center; margin-top:0.5rem;">
          Copied to clipboard!
        </p>
      </div>

      <div class="info-card note">
        <h3>⚠️ Important Notes</h3>
        <ul style="padding-left:1.5rem; color:var(--text-secondary);">
          <li>LinkedIn may rate-limit automated requests. The workflow includes Wait nodes to respect rate limits.</li>
          <li>Google Gemini free tier allows 60 requests/minute — more than enough for daily job search.</li>
          <li>Your resume PDF must be at a publicly accessible URL (Google Drive, Dropbox, etc.).</li>
          <li>This workflow is designed for n8n self-hosted or n8n Cloud.</li>
        </ul>
      </div>
    </div>
  `;

  // Scroll to top of detail view
  automationsContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================
// Automation Download / Copy
// ============================================
async function downloadAutomationJSON(automationId) {
  const automation = AUTOMATIONS.find(a => a.id === automationId);
  if (!automation) return;

  try {
    const response = await fetch(automation.jsonFile);
    if (!response.ok) throw new Error('Failed to fetch workflow JSON');

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${automation.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    trackAutomationDownload(automation.id, 'download');
  } catch (error) {
    console.error('Download error:', error);
    alert('Failed to download workflow JSON. Please try again.');
  }
}

async function copyAutomationJSON(automationId) {
  const automation = AUTOMATIONS.find(a => a.id === automationId);
  if (!automation) return;

  try {
    const response = await fetch(automation.jsonFile);
    if (!response.ok) throw new Error('Failed to fetch workflow JSON');

    const text = await response.text();

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    const feedback = document.getElementById('automation-copy-feedback');
    if (feedback) {
      showElement(feedback);
      setTimeout(() => hideElement(feedback), 2000);
    }

    trackAutomationDownload(automation.id, 'copy');
  } catch (error) {
    console.error('Copy error:', error);
    alert('Failed to copy workflow JSON. Please try again.');
  }
}

async function copyLinkedInPost(automationId) {
  const automation = AUTOMATIONS.find(a => a.id === automationId);
  if (!automation) return;

  try {
    await navigator.clipboard.writeText(automation.linkedinPost);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = automation.linkedinPost;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  const feedback = document.getElementById('linkedin-copy-feedback');
  if (feedback) {
    showElement(feedback);
    setTimeout(() => hideElement(feedback), 2000);
  }
}

function trackAutomationDownload(automationId, action) {
  fetch(`${API_BASE}/track-download`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Upload-Password': authPassword
    },
    body: JSON.stringify({
      automationId,
      action,
      email: authEmail
    })
  }).catch(err => console.warn('Track download failed:', err));
}
