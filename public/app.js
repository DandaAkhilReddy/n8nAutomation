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
const viewAiJobsBtn = document.getElementById('view-ai-jobs');

// Upload Elements
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const fileInfo = document.getElementById('file-info');
const fileName = document.getElementById('file-name');
const fileSize = document.getElementById('file-size');
const removeFileBtn = document.getElementById('remove-file');
const progressContainer = document.getElementById('progress-container');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const uploadBtn = document.getElementById('upload-btn');
const resultSection = document.getElementById('result');
const resultLink = document.getElementById('result-link');
const copyBtn = document.getElementById('copy-btn');
const copyFeedback = document.getElementById('copy-feedback');
const uploadAnotherBtn = document.getElementById('upload-another');
const uploadError = document.getElementById('upload-error');
const uploadErrorMessage = document.getElementById('upload-error-message');
const errorDismiss = document.getElementById('error-dismiss');
const uploadCounter = document.getElementById('upload-counter');

// Dashboard Elements
const refreshIdeasBtn = document.getElementById('refresh-ideas');
const ideasLoading = document.getElementById('ideas-loading');
const ideasEmpty = document.getElementById('ideas-empty');
const ideasList = document.getElementById('ideas-list');

// ============================================
// State
// ============================================
let selectedFile = null;
let authPassword = null;
let authEmail = null;
let accessLevel = null; // 'admin' or 'public'

// ============================================
// Constants
// ============================================
const PUBLIC_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ADMIN_MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB (limited by Netlify)
const PUBLIC_MAX_UPLOADS = 10;
const IDEA_BONUS_UPLOADS = 5;
const API_BASE = '/api';
const UPLOAD_COUNT_KEY = 'n8nautomations_upload_count';
const BONUS_UPLOADS_KEY = 'n8nautomations_bonus_uploads';
const IDEA_SUBMITTED_KEY = 'n8nautomations_idea_submitted';
const GATED_TABS = ['upload', 'ai-jobs', 'automations'];

// ============================================
// Automations Configuration
// ============================================
const AUTOMATIONS = [
  {
    id: 'job-search-ultimate',
    icon: '🔍',
    title: 'Job Search Ultimate Workflow',
    shortDesc: 'Automated daily job search: resume parsing, LinkedIn matching, AI scoring, cover letter generation, and email summary.',
    tags: ['LinkedIn', 'Google Gemini', 'Gmail', 'Google Sheets'],
    difficulty: 'Intermediate',
    estimatedSetup: '30 min',
    jsonFile: '/automations/job-search-workflow.json',
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
      'Upload your resume PDF to a publicly accessible URL (you can use the Upload tab on this site!)',
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
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showElement(el) {
  if (el) el.classList.remove('hidden');
}

function hideElement(el) {
  if (el) el.classList.add('hidden');
}

function getUploadCount() {
  return parseInt(localStorage.getItem(UPLOAD_COUNT_KEY) || '0', 10);
}

function incrementUploadCount() {
  const count = getUploadCount() + 1;
  localStorage.setItem(UPLOAD_COUNT_KEY, count.toString());
  return count;
}

function getBonusUploads() {
  return parseInt(localStorage.getItem(BONUS_UPLOADS_KEY) || '0', 10);
}

function addBonusUploads(count) {
  const current = getBonusUploads();
  localStorage.setItem(BONUS_UPLOADS_KEY, (current + count).toString());
  return current + count;
}

function getMaxFileSize() {
  return accessLevel === 'admin' ? ADMIN_MAX_FILE_SIZE : PUBLIC_MAX_FILE_SIZE;
}

function canUpload() {
  if (accessLevel === 'admin') return true;
  const used = getUploadCount();
  const bonus = getBonusUploads();
  const totalAllowed = PUBLIC_MAX_UPLOADS + bonus;
  return used < totalAllowed;
}

function getTotalAllowedUploads() {
  return PUBLIC_MAX_UPLOADS + getBonusUploads();
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

      updateUploadCounter();
      updateTabAccess();
      sessionStorage.setItem('uploadAuth', accessLevel);
      sessionStorage.setItem('uploadEmail', authEmail);
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

    // Clear session storage
    sessionStorage.removeItem('uploadAuth');
    sessionStorage.removeItem('uploadEmail');

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

      // Grant bonus uploads
      if (accessLevel !== 'admin') {
        addBonusUploads(IDEA_BONUS_UPLOADS);
        updateUploadCounter();
      }
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

// View AI Jobs button (after successful idea submission)
if (viewAiJobsBtn) {
  viewAiJobsBtn.addEventListener('click', () => {
    switchTab('ai-jobs');
  });
}

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

if (refreshIdeasBtn) {
  refreshIdeasBtn.addEventListener('click', loadIdeas);
}

// ============================================
// File Upload
// ============================================
function updateUploadCounter() {
  if (!uploadCounter) return;

  if (accessLevel === 'admin') {
    hideElement(uploadCounter);
    return;
  }

  const count = getUploadCount();
  const totalAllowed = getTotalAllowedUploads();
  const remaining = totalAllowed - count;
  const bonus = getBonusUploads();

  let text = `${remaining} uploads remaining (${count}/${totalAllowed} used)`;
  if (bonus > 0) {
    text += ` • ${bonus} bonus from ideas`;
  }

  uploadCounter.textContent = text;
  uploadCounter.classList.remove('warning', 'limit-reached', 'hidden');
  showElement(uploadCounter);

  if (remaining <= 0) {
    uploadCounter.classList.add('limit-reached');
    uploadCounter.textContent = `Upload limit reached (${count}/${totalAllowed}) - Submit an idea for 5 more!`;
  } else if (remaining <= 3) {
    uploadCounter.classList.add('warning');
  }
}

function resetUploadUI() {
  selectedFile = null;
  if (fileInput) fileInput.value = '';
  hideElement(fileInfo);
  hideElement(progressContainer);
  hideElement(resultSection);
  hideElement(uploadError);
  if (uploadBtn) {
    uploadBtn.disabled = true;
    uploadBtn.textContent = 'Upload File';
  }
  if (progressFill) progressFill.style.width = '0%';
  if (progressText) progressText.textContent = '0%';
  showElement(dropZone);
  updateUploadCounter();

  if (!canUpload() && uploadBtn) {
    uploadBtn.disabled = true;
    uploadBtn.textContent = 'Upload Limit Reached';
  }
}

function showUploadError(message) {
  if (uploadErrorMessage) uploadErrorMessage.textContent = message;
  showElement(uploadError);
}

// Drag and Drop
if (dropZone) {
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });

  dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');

    if (!canUpload()) {
      showUploadError('You have reached the upload limit. Submit an idea for 5 more uploads!');
      return;
    }

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  });
}

// File Input
if (fileInput) {
  fileInput.addEventListener('change', (e) => {
    if (!canUpload()) {
      showUploadError('You have reached the upload limit. Submit an idea for 5 more uploads!');
      e.target.value = '';
      return;
    }

    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  });
}

function handleFileSelect(file) {
  const maxSize = getMaxFileSize();

  if (file.size > maxSize) {
    showUploadError(`File is too large. Maximum size is ${formatFileSize(maxSize)}`);
    return;
  }

  selectedFile = file;
  if (fileName) fileName.textContent = file.name;
  if (fileSize) fileSize.textContent = formatFileSize(file.size);
  showElement(fileInfo);
  if (uploadBtn) uploadBtn.disabled = false;
  hideElement(uploadError);
  hideElement(resultSection);
}

// Remove File
if (removeFileBtn) {
  removeFileBtn.addEventListener('click', resetUploadUI);
}

// Upload Button
if (uploadBtn) {
  uploadBtn.addEventListener('click', async () => {
    if (!selectedFile || !authPassword) return;

    if (!canUpload()) {
      showUploadError('You have reached the upload limit. Submit an idea for 5 more uploads!');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    hideElement(dropZone);
    hideElement(fileInfo);
    showElement(progressContainer);
    uploadBtn.disabled = true;

    try {
      const xhr = new XMLHttpRequest();

      const uploadPromise = new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            if (progressFill) progressFill.style.width = percent + '%';
            if (progressText) progressText.textContent = percent + '%';
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            try {
              reject(JSON.parse(xhr.responseText));
            } catch {
              reject({ error: 'Upload failed' });
            }
          }
        });

        xhr.addEventListener('error', () => {
          reject({ error: 'Network error' });
        });

        xhr.open('POST', `${API_BASE}/upload`);
        xhr.setRequestHeader('X-Upload-Password', authPassword);
        xhr.send(formData);
      });

      const result = await uploadPromise;

      if (accessLevel !== 'admin') {
        incrementUploadCount();
      }

      hideElement(progressContainer);
      if (resultLink) resultLink.value = result.url;
      showElement(resultSection);
      updateUploadCounter();

    } catch (error) {
      console.error('Upload error:', error);
      hideElement(progressContainer);
      showUploadError(error.error || error.message || 'Upload failed. Please try again.');
      showElement(dropZone);
      uploadBtn.disabled = false;
    }
  });
}

// Copy Link
if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(resultLink.value);
      showElement(copyFeedback);
      setTimeout(() => hideElement(copyFeedback), 2000);
    } catch (error) {
      resultLink.select();
      document.execCommand('copy');
      showElement(copyFeedback);
      setTimeout(() => hideElement(copyFeedback), 2000);
    }
  });
}

// Upload Another
if (uploadAnotherBtn) {
  uploadAnotherBtn.addEventListener('click', resetUploadUI);
}

// Error Dismiss
if (errorDismiss) {
  errorDismiss.addEventListener('click', () => {
    hideElement(uploadError);
    resetUploadUI();
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
        <div style="font-size:2.5rem; margin-bottom:0.5rem;">${automation.icon}</div>
        <h2>${automation.title}</h2>
        <p>${automation.shortDesc}</p>
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
          <li>Your resume PDF must be at a publicly accessible URL. Use the Upload tab on this site!</li>
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
