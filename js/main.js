let resumeData = null;

// Tab Switching Logic (保持原樣)
function showPage(pageId) {
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');

    const buttons = document.querySelectorAll('.nav-links button:not(.lang-switch)');
    buttons.forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById('btn-' + pageId);
    if(activeBtn) activeBtn.classList.add('active');
}

// Language Switching Logic (保持原樣)
function toggleLanguage() {
    const body = document.body;
    if (body.classList.contains('lang-zh')) {
        body.classList.remove('lang-zh');
        body.classList.add('lang-en');
        document.documentElement.lang = 'en';
    } else {
        body.classList.remove('lang-en');
        body.classList.add('lang-zh');
        document.documentElement.lang = 'zh-TW';
    }
}

// Data Loading & Rendering
window.onload = async () => {
    try {
        const response = await fetch('data.json');
        resumeData = await response.json();
        renderResume();
    } catch (error) {
        console.error("Failed to load data.json", error);
    }
};

// Helper: 產生中英雙語的 HTML 字串，讓 CSS 控制顯示
function dualLang(zhText, enText, isBlock = false) {
    const zhClass = isBlock ? 'zh-text' : 'zh-inline';
    const enClass = isBlock ? 'en-text' : 'en-inline';
    return `<span class="${zhClass}">${zhText}</span><span class="${enClass}">${enText}</span>`;
}

function renderResume() {
    if (!resumeData) return;

    // 1. Profile
    const p = resumeData.profile;
    const profileHtml = `
        <h1>${dualLang(p.name.zh, p.name.en)}</h1>
        <div class="contact-info">
            <span>
                ${dualLang(p.mobile.zh + ':', p.mobile.en + ':')} ${p.mobile.val}
            </span>
            <span>Email: ${p.email}</span>
        </div>
        <div class="social-info">
            <a href="${p.social.linkedin}" target="_blank">LinkedIn</a>
            <a href="${p.social.github}" target="_blank">GitHub</a>
        </div>
    `;
    document.getElementById('profile-container').innerHTML = profileHtml;

    // 2. Intro
    const intro = resumeData.about;
    const introHtml = `
        <h2>${dualLang(intro.title.zh, intro.title.en)}</h2>
        <div class="zh-text">${intro.content.zh.map(p => `<p>${p}</p>`).join('')}</div>
        <div class="en-text">${intro.content.en.map(p => `<p>${p}</p>`).join('')}</div>
    `;
    document.getElementById('intro-container').innerHTML = introHtml;

    // 3. Experience
    const exp = resumeData.experience;
    let expHtml = `<h2>${dualLang(exp.title.zh, exp.title.en)}</h2>`;
    
    exp.jobs.forEach(job => {
        // Helper to render details list (handles nested lists)
        const renderDetails = (details) => {
            return `<ul>` + details.map(item => {
                if (typeof item === 'string') return `<li>${item}</li>`;
                // Handle nested object with sub-list
                return `<li>${item.main}<ul>${item.sub.map(s => `<li>${s}</li>`).join('')}</ul></li>`;
            }).join('') + `</ul>`;
        };

        expHtml += `
            <div class="timeline-item">
                <h3>${dualLang(job.title.zh, job.title.en)}</h3>
                <div class="timeline-date">${job.date}</div>
                <div class="zh-text">${renderDetails(job.details.zh)}</div>
                <div class="en-text">${renderDetails(job.details.en)}</div>
            </div>
        `;
    });
    document.getElementById('experience-container').innerHTML = expHtml;

// 4. Education
    const edu = resumeData.education;
    let eduHtml = `<h2>${dualLang(edu.title.zh, edu.title.en)}</h2>`;
    
    edu.schools.forEach(school => {
        // 渲染一般資訊 (轉為 <p>)
        const renderInfo = (list) => list && list.length > 0 ? list.map(d => `<p>${d}</p>`).join('') : '';
        const zhInfo = renderInfo(school.info.zh);
        const enInfo = renderInfo(school.info.en);

        // 渲染條列式成就 (轉為 <ul><li>)
        const renderBullets = (list) => list && list.length > 0 ? `<ul>${list.map(d => `<li>${d}</li>`).join('')}</ul>` : '';
        const zhBullets = renderBullets(school.achievements.zh);
        const enBullets = renderBullets(school.achievements.en);
        
        eduHtml += `
            <div class="timeline-item">
                <h3>${dualLang(school.title.zh, school.title.en)}</h3>
                <div class="timeline-date">${school.date}</div>
                <div class="zh-text">${zhInfo}${zhBullets}</div>
                <div class="en-text">${enInfo}${enBullets}</div>
                ${school.stack ? `<div class="tech-stack">${school.stack}</div>` : ''}
            </div>
        `;
    });
    document.getElementById('education-container').innerHTML = eduHtml;

    // 5. Languages
    const lang = resumeData.languages;
    let langHtml = `<h2>${dualLang(lang.title.zh, lang.title.en)}</h2><ul>`;
    lang.list.forEach(item => {
        langHtml += `<li>${dualLang(item.zh, item.en)}</li>`;
    });
    langHtml += `</ul>`;
    document.getElementById('languages-container').innerHTML = langHtml;

    // 6. Skills (Page 2)
    const skills = resumeData.skills;
    let skillsHtml = `<h2>${dualLang(skills.title.zh, skills.title.en)}</h2><div class="skills-grid">`;
    skills.categories.forEach(cat => {
        skillsHtml += `
            <div class="skill-category">
                <h3>${dualLang(cat.title.zh, cat.title.en)}</h3>
                <div class="skill-tags">
                    ${cat.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
    });
    skillsHtml += `</div>`;
    document.getElementById('skills-container').innerHTML = skillsHtml;

    // 7. Projects (Page 3)
    const proj = resumeData.projects;
    let projHtml = `<h2>${dualLang(proj.title.zh, proj.title.en)}</h2>`;
    proj.items.forEach(item => {
        projHtml += `
            <div class="project-item">
                <h3>${dualLang(item.title.zh, item.title.en)}</h3>
                <div class="zh-text"><p>${item.desc.zh}</p></div>
                <div class="en-text"><p>${item.desc.en}</p></div>
                <div class="tech-stack">${item.stack}</div>
            </div>
        `;
    });
    document.getElementById('projects-container').innerHTML = projHtml;
}

function downloadHTML() {
    if (!resumeData) return;
    
    const isEn = document.body.classList.contains('lang-en');
    const p = resumeData.profile;

    const styleContent = `
        body {
            text-align: left;
            line-height: 1.25;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px; /* 增加閱讀寬度限制 */
            margin: 0 auto;   /* 居中 */
            padding: 20px;
        }
        h1, h2, h3, h4 {
            margin-bottom: 2px !important;
            margin-top: 12px;
            padding-bottom: 2px;
            color: #2c3e50; /* 增加一點顏色 */
        }
        h1 { margin-bottom: 5px !important; font-size: 24px; text-align: center; } /* 名字置中 */
        h2 { border-bottom: 2px solid #3498db; margin-top: 20px; } /* 標題加底線 */
        ul { margin-top: 0 !important; padding-top: 0; margin-bottom: 8px; padding-left: 20px; }
        li { margin-bottom: 2px; }
        p { margin-top: 0 !important; margin-bottom: 5px; }
        .contact-info { text-align: center; margin-bottom: 20px; font-size: 0.9rem; color: #666; }
        .date { float: right; font-weight: normal; font-size: 0.9rem; color: #666; }
        .tech-stack { font-size: 0.85rem; color: #555; font-style: italic; margin-top: 3px; }
    `;

    // 2. 開始組裝 HTML 字串
    let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Resume</title><style>${styleContent}</style></head><body>`;

    // --- Header ---
    html += `<h1>${isEn ? p.name.en : p.name.zh}</h1>`;
    html += `<div class="contact-info">
                ${isEn ? p.mobile.en : p.mobile.zh}: ${p.mobile.val} | 
                Email: ${p.email} <br>
                <a href="${p.social.linkedin}">LinkedIn</a> | <a href="${p.social.github}">GitHub</a>
             </div>`;

    // --- Intro ---
    html += `<h2>${isEn ? resumeData.about.title.en : resumeData.about.title.zh}</h2>`;
    const introText = isEn ? resumeData.about.content.en : resumeData.about.content.zh;
    introText.forEach(text => html += `<p>${text}</p>`);

    // --- Skills ---
    html += `<h2>${isEn ? resumeData.skills.title.en : resumeData.skills.title.zh}</h2><ul>`;
    const cats = resumeData.skills.categories;
    cats.forEach(cat => {
        html += `<li><strong>${isEn ? cat.title.en : cat.title.zh}</strong>: ${cat.tags.join(', ')}</li>`;
    });
    html += `</ul>`;

    // --- Languages ---
    html += `<h2>${isEn ? resumeData.languages.title.en : resumeData.languages.title.zh}</h2><ul>`;
    resumeData.languages.list.forEach(l => {
        html += `<li>${isEn ? l.en : l.zh}</li>`;
    });
    html += `</ul>`;

    // --- Experience ---
    html += `<h2>${isEn ? resumeData.experience.title.en : resumeData.experience.title.zh}</h2>`;
    const jobs = resumeData.experience.jobs;
    jobs.forEach(job => {
        html += `<h3>
                    ${isEn ? job.title.en : job.title.zh}
                    <span class="date">${job.date}</span>
                 </h3>`;
        
        const details = isEn ? job.details.en : job.details.zh;
        html += `<ul>`;
        details.forEach(item => {
            if (typeof item === 'string') {
                html += `<li>${item}</li>`;
            } else {
                html += `<li>${item.main}<ul>${item.sub.map(s => `<li>${s}</li>`).join('')}</ul></li>`;
            }
        });
        html += `</ul>`;
    });

    // --- Projects ---
    html += `<h2>${isEn ? resumeData.projects.title.en : resumeData.projects.title.zh}</h2>`;
    const projs = resumeData.projects.items;
    projs.forEach(pj => {
        html += `<h3>${isEn ? pj.title.en : pj.title.zh}</h3>`;
        html += `<p>${isEn ? pj.desc.en : pj.desc.zh}</p>`;
        html += `<p class="tech-stack">${pj.stack}</p>`;
    });
    html += `</ul>`;

    // --- Education ---
    html += `<h2>${isEn ? resumeData.education.title.en : resumeData.education.title.zh}</h2>`;
    const schools = resumeData.education.schools;
    schools.forEach(sch => {
        html += `<h3>
                    ${isEn ? sch.title.en : sch.title.zh}
                    <span class="date">${sch.date}</span>
                 </h3>`;
        
        // Info (P)
        const infos = isEn ? sch.info.en : sch.info.zh;
        infos.forEach(i => html += `<p>${i}</p>`);
        
        // Achievements (UL)
        const achs = isEn ? sch.achievements.en : sch.achievements.zh;
        if (achs && achs.length > 0) {
            html += `<ul>${achs.map(a => `<li>${a}</li>`).join('')}</ul>`;
        }
        
        // Stack
        if (sch.stack) html += `<p class="tech-stack">${sch.stack}</p>`;
    });

    html += `</body></html>`;

    // 3. 下載檔案
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Resume_${isEn ? 'ChengZhe_Wu' : '吳承哲'}.html`; // 副檔名改為 .html
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}