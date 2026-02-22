<div align="center">

# 📤 UploadGetLink

### Upload files. Get links. Share instantly.

[![Netlify Status](https://api.netlify.com/api/v1/badges/c22c4328-0077-4cf8-9916-94b28f86b799/deploy-status)](https://app.netlify.com/sites/uploadgetlink/deploys)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Azure](https://img.shields.io/badge/Azure-Blob%20Storage-0078D4?logo=microsoftazure)](https://azure.microsoft.com/)
[![Netlify](https://img.shields.io/badge/Hosted%20on-Netlify-00C7B7?logo=netlify)](https://netlify.com/)

[**Live Demo**](https://uploadgetlink.netlify.app) · [Report Bug](https://github.com/DandaAkhilReddy/uploadgetlink/issues) · [Request Feature](https://github.com/DandaAkhilReddy/uploadgetlink/issues)

</div>

---

## 🌟 What is UploadGetLink?

UploadGetLink is a simple, fast, and secure file sharing service. Upload any file and get a permanent shareable link instantly. No sign-up required, just enter the password and start sharing!

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Password Protected** | Two-tier access: Admin (unlimited) & Public (10 files) |
| 📁 **Drag & Drop** | Modern drag-and-drop interface for easy uploads |
| 📊 **Progress Tracking** | Real-time upload progress indicator |
| 📋 **One-Click Copy** | Copy shareable links instantly to clipboard |
| 🔗 **Permanent Links** | Files stored permanently - links never expire |
| 📱 **Responsive Design** | Works beautifully on desktop and mobile |
| 🌙 **Dark Theme** | Easy on the eyes with a modern dark UI |
| ⚡ **Serverless** | Powered by Netlify Functions - fast and scalable |
| 🤖 **n8n Automations** | Ready-to-use automation workflows you can download |

---

## 🤖 n8n Automations

Browse the **n8n Automations** tab to find ready-to-use workflows you can import directly into your n8n instance.

### Available Automations

| Automation | Description | Required Services |
|-----------|-------------|-------------------|
| 🔍 **Job Search Ultimate** | Daily automated job search with AI scoring and cover letter generation | Google Gemini, Google Sheets, Gmail |

### How to Use

1. Log in to UploadGetLink with the public password
2. Go to the **n8n Automations** tab
3. Click on a workflow to see details and setup instructions
4. Download or copy the workflow JSON
5. Import into your n8n instance (Settings > Import from File)
6. Configure your own API credentials
7. Activate and enjoy!

> **Note:** You bring your own API keys. These automations run on your infrastructure at zero cost.

---

## 🚀 How It Works

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   1. Enter  │ ──▶ │  2. Upload  │ ──▶ │  3. Share   │
│   Password  │     │    File     │     │    Link     │
└─────────────┘     └─────────────┘     └─────────────┘
```

1. **Enter Password** - Use admin or public password to access
2. **Upload File** - Drag & drop or browse to select your file
3. **Share Link** - Copy the permanent link and share anywhere!

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
uploadgetlink/
├── public/
│   ├── automations/
│   │   └── job-search-workflow.json  # n8n workflow JSON
│   ├── index.html          # Main upload interface
│   ├── styles.css          # Light theme styling
│   └── app.js              # Frontend logic
├── netlify/
│   └── functions/
│       ├── auth.js         # Password authentication
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

## 🔑 Access Levels

| Level | Password | Upload Limit | Use Case |
|-------|----------|--------------|----------|
| **Admin** | Your admin password | ♾️ Unlimited | Personal use |
| **Public** | Your public password | 10 files | Share with others |

---

## 📄 Supported File Types

| Category | Extensions |
|----------|------------|
| 📄 Documents | `.pdf`, `.doc`, `.docx`, `.txt`, `.rtf`, `.csv` |
| 📊 Spreadsheets | `.xls`, `.xlsx` |
| 📽️ Presentations | `.ppt`, `.pptx` |
| 🖼️ Images | `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg` |
| 🎵 Audio | `.mp3` |
| 🎬 Video | `.mp4`, `.mov`, `.avi`, `.mkv` |
| 📦 Archives | `.zip`, `.rar`, `.7z` |
| 💻 Data | `.json`, `.xml` |

> **Note:** Maximum file size is ~4.5MB due to Netlify Functions payload limits.

---

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+
- Azure account (for Blob Storage)
- Netlify account

### Local Development

```bash
# Clone the repository
git clone https://github.com/DandaAkhilReddy/uploadgetlink.git
cd uploadgetlink

# Install dependencies
npm install

# Create .env file with your credentials
cat > .env << EOF
AZURE_STORAGE_CONNECTION_STRING=your_connection_string
AZURE_CONTAINER_NAME=uploads
ADMIN_PASSWORD=your_admin_password
PUBLIC_PASSWORD=your_public_password
EOF

# Run locally with Netlify CLI
npm run dev
```

---

## 🚀 Deploy Your Own

### 1. Azure Setup

1. Create an Azure Storage Account
2. Enable "Allow Blob anonymous access" in Configuration
3. Create a container named `uploads` with **Blob** public access level
4. Copy the connection string

### 2. Netlify Deployment

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/DandaAkhilReddy/uploadgetlink)

Or manually:

1. Fork this repository
2. Connect to Netlify
3. Add environment variables (see below)
4. Deploy!

### 3. Environment Variables

Configure these in Netlify Dashboard → Site Settings → Environment Variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `AZURE_STORAGE_CONNECTION_STRING` | Azure Storage connection string | ✅ |
| `AZURE_CONTAINER_NAME` | Container name (default: `uploads`) | ✅ |
| `ADMIN_PASSWORD` | Password for unlimited uploads | ✅ |
| `PUBLIC_PASSWORD` | Password for public access (10 files) | ✅ |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        User Browser                          │
│              (Vanilla HTML/CSS/JavaScript)                   │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                    Netlify CDN/Hosting                       │
│                  (Static Files + Functions)                  │
└──────────────────────────┬───────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
┌─────────────────────┐    ┌─────────────────────┐
│   /api/auth         │    │   /api/upload       │
│   (Verify Password) │    │   (Handle Upload)   │
└─────────────────────┘    └──────────┬──────────┘
                                      │
                                      ▼
                    ┌─────────────────────────────────┐
                    │      Azure Blob Storage         │
                    │   (Permanent File Storage)      │
                    │                                 │
                    │  https://storage.blob.core...   │
                    └─────────────────────────────────┘
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

## 🙏 Acknowledgments

- [Netlify](https://netlify.com) for serverless hosting
- [Azure](https://azure.microsoft.com) for blob storage
- [Claude Code](https://claude.com/claude-code) for AI-assisted development

---

<div align="center">

**Made with ❤️ by [Akhil Reddy](https://github.com/DandaAkhilReddy)**

⭐ Star this repo if you found it helpful!

</div>
