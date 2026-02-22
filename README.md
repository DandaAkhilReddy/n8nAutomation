<div align="center">

# 🤖 Danda Akhil Reddy N8n Automations

### Daily n8n automation workflows — built for you, 100% free.

[![Netlify Status](https://api.netlify.com/api/v1/badges/c22c4328-0077-4cf8-9916-94b28f86b799/deploy-status)](https://app.netlify.com/sites/n8nautomationss/deploys)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Azure](https://img.shields.io/badge/Azure-Blob%20Storage-0078D4?logo=microsoftazure)](https://azure.microsoft.com/)
[![Netlify](https://img.shields.io/badge/Hosted%20on-Netlify-00C7B7?logo=netlify)](https://netlify.com/)

[**Live Site**](https://n8nautomationss.netlify.app) · [Report Bug](https://github.com/DandaAkhilReddy/n8nAutomation/issues) · [Request Feature](https://github.com/DandaAkhilReddy/n8nAutomation/issues)

</div>

---

## 🌟 What is this?

A platform where you submit your daily automation ideas and I build them for free using n8n. New automations are added daily — browse, download, and import them into your own n8n instance.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 💡 **Idea Submissions** | Tell me what to automate — I'll build it within a week |
| 🤖 **n8n Automations** | Ready-to-use workflows you can download and import |
| 📤 **File Uploads** | Upload files and get shareable links (powered by Azure Blob) |
| 💰 **AI Jobs** | Curated guide to earning $10-$200/hr training AI |
| 📱 **Responsive Design** | Works beautifully on desktop and mobile |
| ⚡ **Serverless** | Powered by Netlify Functions — fast and scalable |

---

## 🤖 n8n Automations

Browse the **n8n Automations** tab to find ready-to-use workflows you can import directly into your n8n instance.

### Available Automations

| Automation | Description | Required Services |
|-----------|-------------|-------------------|
| 🔍 **Job Search Ultimate** | Daily automated job search with AI scoring and cover letter generation | Google Gemini, Google Sheets, Gmail |

### How to Use

1. Log in with your email
2. Submit an automation idea to unlock all tabs
3. Go to the **n8n Automations** tab
4. Click on a workflow to see details and setup instructions
5. Download or copy the workflow JSON
6. Import into your n8n instance (Settings > Import from File)
7. Configure your own API credentials
8. Activate and enjoy!

> **Note:** You bring your own API keys. These automations run on your infrastructure at zero cost.

---

## 🛠️ Tech Stack

<div align="center">

| Frontend | Backend | Storage | Hosting |
|:--------:|:-------:|:-------:|:-------:|
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) | ![Netlify Functions](https://img.shields.io/badge/Netlify_Functions-00C7B7?style=flat&logo=netlify&logoColor=white) | ![Azure Blob](https://img.shields.io/badge/Azure_Blob-0078D4?style=flat&logo=microsoftazure&logoColor=white) | ![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=flat&logo=netlify&logoColor=white) |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white) | | |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) | | | |

</div>

---

## 📁 Project Structure

```
n8nAutomation/
├── public/
│   ├── automations/
│   │   └── job-search-workflow.json  # n8n workflow JSON
│   ├── index.html          # Main interface
│   ├── styles.css          # Styling
│   └── app.js              # Frontend logic
├── netlify/
│   └── functions/
│       ├── auth.js         # Email authentication
│       ├── get-ideas.js    # Fetch submitted ideas (admin)
│       ├── submit-idea.js  # Idea submission handler
│       ├── track-download.js  # Automation download analytics
│       ├── upload.js       # File upload handler
│       └── utils/
│           └── azure-client.js  # Azure Blob client
├── netlify.toml            # Netlify configuration
├── package.json            # Dependencies
└── README.md
```

---

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+
- Azure account (for Blob Storage)
- Netlify account

### Local Development

```bash
# Clone the repository
git clone https://github.com/DandaAkhilReddy/n8nAutomation.git
cd n8nAutomation

# Install dependencies
npm install

# Create .env file with your credentials
cat > .env << EOF
AZURE_STORAGE_CONNECTION_STRING=your_connection_string
AZURE_CONTAINER_NAME=uploads
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
EOF

# Run locally with Netlify CLI
npm run dev
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🔃 Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ by [Danda Akhil Reddy](https://github.com/DandaAkhilReddy)**

⭐ Star this repo if you found it helpful!

</div>
