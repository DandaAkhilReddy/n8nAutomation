<div align="center">

# 🤖 Danda Akhil Reddy N8n Automations

### 1 new automation every day — built from your ideas, 100% free.

[![Netlify Status](https://api.netlify.com/api/v1/badges/c22c4328-0077-4cf8-9916-94b28f86b799/deploy-status)](https://app.netlify.com/sites/n8nautomationss/deploys)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Azure](https://img.shields.io/badge/Azure-Blob%20Storage-0078D4?logo=microsoftazure)](https://azure.microsoft.com/)
[![Netlify](https://img.shields.io/badge/Hosted%20on-Netlify-00C7B7?logo=netlify)](https://netlify.com/)

[**Live Site**](https://n8nautomationss.netlify.app) · [Report Bug](https://github.com/DandaAkhilReddy/n8nAutomation/issues) · [Request Feature](https://github.com/DandaAkhilReddy/n8nAutomation/issues)

</div>

---

## 🎯 The Mission

I'm building **1 new n8n automation every single day** and publishing it here for free.

You tell me what repetitive task eats up your time. I build the automation. You download it, plug in your own API keys, and run it on your own n8n instance — **zero cost**.

Every automation also gets a LinkedIn post breaking down how it works and why it matters.

---

## 🔄 How It Works

```
You submit an idea  →  I build the automation  →  You download & run it
     (email)              (within a week)           (your n8n, your keys)
```

1. **Visit** [n8nautomationss.netlify.app](https://n8nautomationss.netlify.app)
2. **Enter your email** to log in
3. **Submit an automation idea** — what daily problem do you want solved?
4. **Unlock all tabs** — browse automations, upload files, check AI jobs
5. **Download any workflow** — import the JSON into your n8n instance
6. **Add your own API keys** — follow the setup instructions
7. **Activate and enjoy** — the automation runs on your schedule

> You bring your own API keys. These automations run on your infrastructure at zero cost to you.

---

## 📅 Automation Log

| Day | Date | Automation | Status |
|-----|------|-----------|--------|
| 1 | Feb 22, 2026 | 🔍 **Job Search Ultimate** — Daily job search with AI scoring & cover letters | ✅ Shipped |
| 2 | Feb 23, 2026 | *Coming soon — submit your idea!* | 🔜 Next |

*This table updates daily. Star the repo to stay notified!*

---

## ✨ Platform Features

| Feature | Description |
|---------|-------------|
| 💡 **Idea Submissions** | Tell me what to automate — I'll build it within a week |
| 🤖 **Daily Automations** | New n8n workflow every day, ready to download and import |
| 💼 **LinkedIn Posts** | Each automation comes with a post you can copy and share |
| 📤 **File Uploads** | Upload files and get shareable links (powered by Azure Blob) |
| 💰 **AI Jobs Guide** | Curated guide to earning $10-$200/hr training AI |
| 📱 **Responsive** | Works on desktop and mobile |
| ⚡ **Serverless** | Netlify Functions + Azure — fast and scalable |

---

## 🤖 Available Automations

| Automation | Description | Required Services |
|-----------|-------------|-------------------|
| 🔍 **Job Search Ultimate** | Runs daily at 5AM: parses your resume, finds matching jobs on LinkedIn, scores them with AI, generates cover letters, logs to Google Sheets, emails you a summary | Google Gemini, Google Sheets, Gmail |

---

## 🛠️ Tech Stack

<div align="center">

| Frontend | Backend | Storage | Hosting |
|:--------:|:-------:|:-------:|:-------:|
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) | ![Netlify Functions](https://img.shields.io/badge/Netlify_Functions-00C7B7?style=flat&logo=netlify&logoColor=white) | ![Azure Blob](https://img.shields.io/badge/Azure_Blob-0078D4?style=flat&logo=microsoftazure&logoColor=white) | ![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=flat&logo=netlify&logoColor=white) |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white) | ![Azure Tables](https://img.shields.io/badge/Azure_Tables-0078D4?style=flat&logo=microsoftazure&logoColor=white) | |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) | | | |

</div>

---

## 📁 Project Structure

```
n8nAutomation/
├── public/
│   ├── automations/
│   │   └── job-search-workflow.json  # n8n workflow JSON (1 per automation)
│   ├── index.html          # Main interface
│   ├── styles.css          # Styling
│   └── app.js              # Frontend logic + automation catalog
├── netlify/
│   └── functions/
│       ├── auth.js            # Email authentication
│       ├── get-ideas.js       # Fetch submitted ideas (admin)
│       ├── submit-idea.js     # Idea submission handler
│       ├── track-download.js  # Download analytics
│       ├── upload.js          # File upload handler
│       └── utils/
│           └── azure-client.js  # Azure Blob client
├── netlify.toml            # Netlify configuration
├── package.json            # Dependencies
└── README.md
```

---

## 🏃‍♂️ Local Development

```bash
git clone https://github.com/DandaAkhilReddy/n8nAutomation.git
cd n8nAutomation
npm install

# Create .env with your credentials
cat > .env << EOF
AZURE_STORAGE_CONNECTION_STRING=your_connection_string
AZURE_CONTAINER_NAME=uploads
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
EOF

npm run dev
```

---

## 🤝 Contributing

Got an automation idea? Submit it on the [live site](https://n8nautomationss.netlify.app)!

Want to contribute code?

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-automation`)
3. Commit your changes
4. Open a Pull Request

---

## 📝 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Made with ❤️ by [Danda Akhil Reddy](https://github.com/DandaAkhilReddy)**

⭐ Star this repo to get notified when new automations drop daily!

</div>
