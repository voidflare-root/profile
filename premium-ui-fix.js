(() => {
  const REPO = window.PORTFOLIO_REPO || "voidflare-root/profile";
  const SKILLS = [
    ["fa-brands fa-android", "Android Development", "android-development.txt"],
    ["fa-solid fa-code", "Kotlin", "kotlin.txt"],
    ["fa-brands fa-python", "Python", "python.txt"],
    ["fa-solid fa-globe", "Web Development", "web-development.txt"],
    ["fa-brands fa-java", "Java", "java.txt"],
    ["fa-brands fa-html5", "HTML", "html.txt"],
    ["fa-brands fa-css3-alt", "CSS", "css.txt"],
    ["fa-solid fa-laptop-code", "Coding", "coding.txt"],
    ["fa-solid fa-user-secret", "Hacking", "hacking.txt"],
    ["fa-solid fa-robot", "AI Tools", "ai-tools.txt"],
    ["fa-brands fa-telegram", "Telegram Bots", "telegram-bots.txt"],
  ];

  function addStyles() {
    document.querySelector("#premiumUiStyles")?.remove();
    const style = document.createElement("style");
    style.id = "premiumUiStyles";
    style.textContent = `
      body{background:radial-gradient(circle at 16% -8%,rgba(168,85,247,.34),transparent 36%),radial-gradient(circle at 92% 12%,rgba(34,197,94,.12),transparent 28%),radial-gradient(circle at 50% 112%,rgba(138,43,226,.22),transparent 34%),#030306!important}.profile-card,.posts-section{border-color:rgba(190,132,255,.38)!important;background:linear-gradient(145deg,rgba(255,255,255,.105),rgba(255,255,255,.035))!important;box-shadow:0 24px 90px rgba(0,0,0,.48),0 0 42px rgba(168,85,247,.16),inset 0 1px 0 rgba(255,255,255,.12)!important}.dp-ring{background:conic-gradient(from 180deg,#8a2be2,#d8b4fe,#fff,#a855f7,#8a2be2)!important;box-shadow:0 0 26px rgba(168,85,247,.72),0 0 70px rgba(168,85,247,.28)!important}.name-stack>span{display:inline-flex!important;width:max-content;max-width:100%;padding:5px 10px;border:1px solid rgba(168,85,247,.32);border-radius:999px;background:rgba(168,85,247,.12);font-size:.72rem!important}.name-row{display:flex!important;align-items:center!important;gap:clamp(10px,2vw,16px)!important;flex-wrap:nowrap!important;min-width:0!important}.name-row h1{flex:0 1 auto!important;min-width:0!important}.instagram-link{flex:0 0 auto!important}h1{background:linear-gradient(180deg,#fff,#e8d5ff 45%,#a855f7);-webkit-background-clip:text;background-clip:text;color:transparent!important;text-shadow:0 0 28px rgba(168,85,247,.34)!important}
      .posts-toggle,.others-toggle,.notes-toggle,.tools-toggle,.projects-toggle,.action-row button,.action-row a,.role-boxes span,.social-name-row a,.tab-card-grid article,.note-item,.project-item{border-color:rgba(190,132,255,.34)!important;background:linear-gradient(145deg,rgba(255,255,255,.12),rgba(255,255,255,.045))!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.1),0 10px 28px rgba(0,0,0,.18)!important}.posts-toggle.is-open,.others-toggle.is-open,.notes-toggle.is-open,.tools-toggle.is-open,.projects-toggle.is-open{border-color:rgba(216,180,254,.64)!important;background:linear-gradient(145deg,rgba(168,85,247,.28),rgba(255,255,255,.07))!important;box-shadow:0 0 32px rgba(168,85,247,.42),inset 0 1px 0 rgba(255,255,255,.14)!important}.post-card{border:1px solid rgba(216,180,254,.2)!important;border-radius:20px!important;background:#080810!important;box-shadow:0 14px 40px rgba(0,0,0,.32),0 0 24px rgba(168,85,247,.1),inset 0 1px 0 rgba(255,255,255,.08)!important}
      .info-section,.stories-section,#noteModal,.note-modal,.note-modal.is-open{display:none!important;visibility:hidden!important;pointer-events:none!important;width:0!important;height:0!important;max-height:0!important;overflow:hidden!important}.tab-panel[hidden]{display:none!important}.notes-list:empty{display:none!important}#noteClose,#noteCanvasClose{display:none!important}.section-title{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;align-items:center;gap:8px}.posts-toggle,.others-toggle,.notes-toggle,.tools-toggle,.projects-toggle{min-height:38px;border:1px solid rgba(168,85,247,.32);border-radius:999px;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:0 10px;color:#fff;background:rgba(255,255,255,.065);cursor:pointer;font-size:.8rem;font-weight:900}.notes-panel,.projects-panel{padding:12px!important}.notes-list{display:grid;gap:10px}.note-item,.project-item{min-height:74px;border:1px solid rgba(168,85,247,.24);border-radius:18px;display:grid;gap:10px;padding:12px}.note-actions,.project-actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.note-actions a,.note-actions button,.project-actions a,.project-actions button{min-height:38px;border:1px solid rgba(168,85,247,.28);border-radius:14px;display:inline-flex;align-items:center;justify-content:center;gap:8px;color:#fff;background:rgba(255,255,255,.06);cursor:pointer;font-size:.82rem;font-weight:900;text-decoration:none}.project-title{display:flex;align-items:center;gap:9px;color:#fff;font-weight:950}.project-title i{width:34px;height:34px;border:1px solid rgba(216,180,254,.35);border-radius:13px;display:grid;place-items:center;color:#d8b4fe;background:rgba(168,85,247,.16)}.project-desc{margin:0;color:#b8b8b8;font-size:.82rem;line-height:1.55}
      .tab-panel[data-panel="skills"]{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:10px!important;padding:12px!important}.tab-panel[data-panel="skills"][hidden]{display:none!important}.tab-panel[data-panel="skills"] article{position:relative;min-height:116px!important;border:1px solid rgba(216,180,254,.34)!important;border-radius:22px!important;display:grid!important;place-items:center!important;align-content:center!important;gap:10px!important;padding:14px 8px!important;text-align:center!important;background:radial-gradient(circle at 50% 0,rgba(216,180,254,.18),transparent 46%),linear-gradient(145deg,rgba(168,85,247,.18),rgba(255,255,255,.045))!important}.tab-panel[data-panel="skills"] article i{width:42px;height:42px;border:1px solid rgba(216,180,254,.38);border-radius:16px;display:grid;place-items:center;color:#fff!important;background:rgba(168,85,247,.2);font-size:1.35rem!important;box-shadow:0 0 26px rgba(168,85,247,.34)}.tab-panel[data-panel="skills"] article strong{font-size:.78rem!important;line-height:1.2!important;overflow-wrap:anywhere}
      @media (max-width:1023px){.app-shell{width:min(100%,980px)!important;display:block!important;margin:0 auto!important}.profile-card,.posts-section{width:min(720px,100%)!important;margin-left:auto!important;margin-right:auto!important}.posts-section{margin-top:16px!important}}@media (min-width:1024px){.app-shell{width:min(1120px,calc(100% - 48px))!important;display:grid!important;grid-template-columns:minmax(360px,430px) minmax(0,1fr)!important;gap:22px!important;align-items:start!important}.profile-card{position:sticky!important;top:22px!important;width:100%!important;margin:0!important;grid-column:1!important;grid-row:1 / span 8!important}.posts-section{width:100%!important;grid-column:2!important;margin-top:0!important}}@media (max-width:520px){.app-shell{padding:12px 10px 42px!important}.profile-card{padding:16px!important;border-radius:26px!important}.section-title{gap:5px!important;padding:13px!important}.posts-toggle,.others-toggle,.notes-toggle,.tools-toggle,.projects-toggle{min-height:38px!important;padding:0 4px!important;font-size:.68rem!important;gap:4px}.post-grid,.story-grid,.tab-card-grid{gap:7px!important;padding:8px!important}.note-actions,.project-actions{grid-template-columns:1fr!important}}
    `;
    document.head.appendChild(style);
  }

  const title = (name) => name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  const unique = (items, keyFn) => { const seen = new Set(); return items.filter((item) => { const key = keyFn(item); if (seen.has(key)) return false; seen.add(key); return true; }); };

  function normalizeDownloadUrl(url) {
    if (!url) return "";
    const trimmed = url.trim();
    try {
      const parsed = new URL(trimmed, location.href);
      if (parsed.hostname === "github.com" && parsed.pathname.includes("/blob/")) {
        const parts = parsed.pathname.split("/").filter(Boolean);
        const owner = parts[0], repo = parts[1], branchIndex = parts.indexOf("blob") + 1;
        const branch = parts[branchIndex];
        const filePath = parts.slice(branchIndex + 1).map(encodeURIComponent).join("/");
        return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
      }
      if (parsed.hostname.endsWith("dropbox.com")) parsed.searchParams.set("dl", "1");
      return parsed.toString();
    } catch { return trimmed; }
  }

  function dedupeList(selector) {
    const list = document.querySelector(selector);
    if (!list) return;
    const seen = new Set();
    Array.from(list.children).forEach((item) => {
      const label = item.querySelector("strong")?.textContent?.trim().toLowerCase() || "";
      const link = item.querySelector("a[href]")?.href || item.querySelector(".project-download")?.dataset.download || "";
      const key = `${label}|${link}`;
      if (seen.has(key)) item.remove(); else seen.add(key);
    });
  }

  function hideLegacyNote() {
    const note = document.querySelector("#noteModal");
    if (!note) return;
    note.classList.remove("is-open"); note.hidden = true; note.setAttribute("aria-hidden", "true");
    note.style.setProperty("display", "none", "important"); note.style.setProperty("visibility", "hidden", "important"); note.style.setProperty("height", "0", "important");
    document.querySelector("#noteFrame")?.removeAttribute("src");
  }

  function ensureProjectsUi() {
    const titleBar = document.querySelector("#posts .section-title");
    if (titleBar && !document.querySelector("#projectsToggle")) {
      const button = document.createElement("button");
      button.className = "projects-toggle"; button.id = "projectsToggle"; button.type = "button";
      button.innerHTML = '<i class="fa-solid fa-folder-open"></i><span>Projects</span>';
      titleBar.appendChild(button);
    }
    let panel = document.querySelector('.tab-panel[data-panel="projects"]');
    if (!panel) { panel = document.createElement("div"); panel.dataset.panel = "projects"; panel.hidden = true; document.querySelector('.tab-panel[data-panel="tools"]')?.after(panel); }
    panel.className = "tab-panel notes-panel projects-panel";
    if (!panel.querySelector("#projectsList")) panel.innerHTML = '<div class="notes-head"><i class="fa-solid fa-folder-open"></i><strong>Projects</strong></div><div class="notes-list" id="projectsList"></div>';
  }

  const cdnUrl = (path) => `https://cdn.jsdelivr.net/gh/${REPO}@main/${path.split("/").map(encodeURIComponent).join("/")}`;
  async function folderFiles(folder) {
    try {
      const r = await fetch(`https://api.github.com/repos/${REPO}/contents/${folder}?t=${Date.now()}`, { cache: "no-store" });
      if (r.ok) return (await r.json()).filter((f) => f.type === "file" && !f.name.startsWith(".") && !f.name.toLowerCase().startsWith("readme.") && f.download_url);
    } catch {}
    try {
      const r = await fetch(`https://data.jsdelivr.com/v1/package/gh/${REPO}@main/flat?t=${Date.now()}`, { cache: "no-store" });
      if (!r.ok) return [];
      const prefix = `/${folder}/`;
      return (await r.json()).files.filter((f) => f.name.startsWith(prefix)).map((f) => { const path = f.name.slice(1); const name = path.split("/").pop(); return { name, path, type: "file", download_url: cdnUrl(path) }; }).filter((f) => !f.name.startsWith(".") && !f.name.toLowerCase().startsWith("readme."));
    } catch { return []; }
  }

  function parseProjectText(text, file) {
    const simpleProjects = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
      const typed = line.match(/^(app|apk|src|source|sourcecode|code|zip)\s*[:=-]?\s+(https?:\/\/\S+)$/i);
      if (typed) {
        const kind = typed[1].toLowerCase().replace(/[^a-z]/g, "");
        const label = kind === "app" || kind === "apk" ? "App" : kind === "src" || kind === "source" || kind === "sourcecode" || kind === "code" ? "Source Code" : kind === "zip" ? "Zip" : "Project";
        return { name: `${title(file.name)} ${label}`, description: `${label} direct download.`, download: normalizeDownloadUrl(typed[2]) };
      }
      const direct = line.match(/^(https?:\/\/\S+)$/i);
      return direct ? { name: title(file.name), description: "Project direct download.", download: normalizeDownloadUrl(direct[1]) } : null;
    }).filter(Boolean);
    if (simpleProjects.length) return simpleProjects;

    const data = {};
    text.split(/\r?\n/).forEach((line) => { const m = line.match(/^\s*([a-z]+)\s*[:=]\s*(.+)\s*$/i); if (m) data[m[1].toLowerCase()] = m[2].trim(); });
    return [{ name: data.name || data.title || title(file.name), description: data.description || data.desc || "Project file ready for download.", download: normalizeDownloadUrl(data.download || data.src || data.link || file.download_url) }];
  }

  async function projectFromFile(file) {
    if (/\.(txt|md|json)$/i.test(file.name)) {
      try {
        const r = await fetch(file.download_url, { cache: "no-store" });
        if (r.ok) {
          if (/\.json$/i.test(file.name)) { const data = await r.json(); const makeProject = (entry, index = 0) => ({ name: entry.name || entry.title || `${title(file.name)}${index ? ` ${index + 1}` : ""}`, description: entry.description || entry.desc || "Project file ready for download.", download: normalizeDownloadUrl(entry.download || entry.src || entry.link || file.download_url) }); return Array.isArray(data) ? data.map(makeProject) : [makeProject(data)]; }
          return parseProjectText(await r.text(), file);
        }
      } catch {}
    }
    return [{ name: title(file.name), description: "Project file ready for download.", download: normalizeDownloadUrl(file.download_url) }];
  }

  function filenameFrom(project) {
    try { const file = decodeURIComponent(new URL(project.download, location.href).pathname.split("/").filter(Boolean).pop() || ""); if (file && file.includes(".")) return file; } catch {}
    return `${(project.name || "project").replace(/[^\w.-]+/g, "-").replace(/^-+|-+$/g, "") || "project"}.zip`;
  }
  function directDownload(project) { if (!project.download) return; const a = document.createElement("a"); a.href = project.download; a.download = filenameFrom(project); a.rel = "noreferrer"; document.body.appendChild(a); a.click(); a.remove(); }
  async function shareProject(project) { const url = `${location.origin}${location.pathname}?project=${encodeURIComponent(project.name)}#projects`; if (navigator.share) { try { await navigator.share({ title: project.name, text: `${project.name} download yahan milega.`, url }); return; } catch { return; } } await navigator.clipboard.writeText(url); const toast = document.querySelector("#toast"); if (toast) { toast.textContent = "Project website link copied."; toast.classList.add("show"); } }
  async function shareFile(file, folder) { const label = title(file.name); const url = `${location.origin}${location.pathname}?${folder}=${encodeURIComponent(file.name)}#${folder}`; if (navigator.share) { try { await navigator.share({ title: label, text: `${label} yahan open/download kar sakte ho.`, url }); return; } catch { return; } } await navigator.clipboard.writeText(url); const toast = document.querySelector("#toast"); if (toast) { toast.textContent = `${title(folder)} link copied.`; toast.classList.add("show"); } }

  function renderProject(project) {
    const item = document.createElement("article"); item.className = "project-item";
    item.innerHTML = `<div class="project-title"><i class="fa-solid fa-folder-open"></i><strong></strong></div><p class="project-desc"></p><div class="project-actions"><a href="#projects"><i class="fa-solid fa-eye"></i><span>Open</span></a><button type="button" class="project-download"><i class="fa-solid fa-download"></i><span>Download</span></button><button type="button"><i class="fa-solid fa-share-nodes"></i><span>Share</span></button></div>`;
    item.querySelector("strong").textContent = project.name; item.querySelector(".project-desc").textContent = project.description; item.querySelector(".project-download").dataset.download = project.download || "";
    item.querySelector(".project-actions a").addEventListener("click", (e) => { e.preventDefault(); item.scrollIntoView({ behavior: "smooth", block: "center" }); });
    item.querySelector(".project-download").addEventListener("click", () => directDownload(project)); item.querySelector(".project-actions button:last-child").addEventListener("click", () => shareProject(project));
    return item;
  }

  async function loadProjects() { const list = document.querySelector("#projectsList"); if (!list) return; list.innerHTML = ""; unique((await Promise.all((await folderFiles("projects")).map(projectFromFile))).flat(), (p) => `${p.name}|${p.download}`).forEach((p) => list.appendChild(renderProject(p))); dedupeList("#projectsList"); }
  function renderSimple(file, folder) { const item = document.createElement("article"); item.className = "note-item"; item.innerHTML = `<strong>${title(file.name)}</strong><div class="note-actions"><button type="button"><i class="fa-solid fa-eye"></i><span>Open</span></button><a href="${file.download_url}" download="${file.name}"><i class="fa-solid fa-download"></i><span>Download</span></a><button type="button" class="file-share"><i class="fa-solid fa-share-nodes"></i><span>Share</span></button></div>`; item.querySelector(".file-share").addEventListener("click", () => shareFile(file, folder)); return item; }
  async function renderSimpleFolder(folder, selector) { const list = document.querySelector(selector); if (!list) return; list.innerHTML = ""; unique(await folderFiles(folder), (f) => `${f.name}|${f.download_url}`).forEach((f) => list.appendChild(renderSimple(f, folder))); dedupeList(selector); }

  function ensureSkills() { const panel = document.querySelector('.tab-panel[data-panel="skills"]'); if (!panel || panel.querySelectorAll('[data-skill-file]').length >= SKILLS.length) return; panel.classList.add("tab-card-grid"); panel.innerHTML = SKILLS.map(([icon, label, file]) => `<article role="button" tabindex="0" data-skill-file="${file}" data-skill-title="${label}" data-skill-icon="${icon}"><i class="${icon}"></i><strong>${label}</strong></article>`).join(""); }
  function activate(panelName) { document.querySelectorAll(".tab-panel").forEach((panel) => { const active = panel.dataset.panel === panelName; panel.hidden = !active; panel.style.display = active ? "" : "none"; panel.classList.toggle("is-active", active); }); const buttons = { posts: "#postsToggle", skills: "#othersToggle", notes: "#notesToggle", tools: "#toolsToggle", projects: "#projectsToggle" }; Object.entries(buttons).forEach(([name, selector]) => document.querySelector(selector)?.classList.toggle("is-open", name === panelName)); document.body.classList.toggle("is-others-mode", panelName !== "posts"); hideLegacyNote(); if (panelName === "projects") loadProjects(); }
  function observeDedupe() { ["#notesList", "#toolsList", "#projectsList"].forEach((selector) => { const list = document.querySelector(selector); if (!list || list.dataset.dedupeObserver === "1") return; list.dataset.dedupeObserver = "1"; new MutationObserver(() => dedupeList(selector)).observe(list, { childList: true }); }); }
  function normalize() { addStyles(); hideLegacyNote(); ensureProjectsUi(); ensureSkills(); renderSimpleFolder("notes", "#notesList"); renderSimpleFolder("tools", "#toolsList"); loadProjects(); observeDedupe(); activate(new URLSearchParams(location.search).has("project") || location.hash === "#projects" ? "projects" : (document.querySelector(".tab-panel.is-active")?.dataset.panel || "posts")); setTimeout(() => { dedupeList("#notesList"); dedupeList("#toolsList"); dedupeList("#projectsList"); }, 1500); }
  document.addEventListener("click", (event) => { const button = event.target.closest("#postsToggle,#othersToggle,#notesToggle,#toolsToggle,#projectsToggle"); if (!button) return; event.preventDefault(); event.stopImmediatePropagation(); activate(button.id === "postsToggle" ? "posts" : button.id === "othersToggle" ? "skills" : button.id === "notesToggle" ? "notes" : button.id === "toolsToggle" ? "tools" : "projects"); }, true);
  if (document.readyState === "loading") window.addEventListener("DOMContentLoaded", normalize); else normalize(); window.addEventListener("load", () => { normalize(); setTimeout(hideLegacyNote, 250); setTimeout(ensureSkills, 500); });
})();
