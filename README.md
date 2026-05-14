# Cloud-Native Data-Driven Resume

A modern personal resume website that treats content as code, using a **Single Source of Truth** architecture where all data lives in `data.json`.

這是一個現代化的履歷網站，將「履歷資料」視為程式碼管理，採用 **Single Source of Truth** 架構，所有內容統一由 `data.json` 維護。

## ✨ Features

* **📄 Data-Driven Rendering**: All content (experience, skills, projects) is fetched from a single `data.json` file.
* **⬇️ Dynamic Resume Generation**: JavaScript-powered engine that generates and downloads a formatted HTML/PDF resume from `data.json`.
* **🌍 Bilingual Support**: Seamlessly toggles between **English** and **Traditional Chinese** without page reloads.
* **🔄 Automated Deployment**: A `git push` to `main` automatically deploys to GitHub Pages via GitHub Actions.

## 🛠️ Tech Stack

| Category | Technology |
| --- | --- |
| **Frontend** | HTML5, CSS3, JavaScript (ES6+), JSON |
| **Hosting** | GitHub Pages |
| **CI/CD** | GitHub Actions |

## ⚙️ Local Development

```bash
python3 -m http.server 8080
```

Visit `http://localhost:8080` to see the site.

## 📄 Resume Export

Click the download button to generate an HTML resume. To convert to PDF, open the file in a browser and press `Ctrl+P` > Save as PDF.
