(() => {
  const REPO = window.PORTFOLIO_REPO || "voidflare-root/profile";
  const PROJECTS_FOLDER = "projects";

  function addStyles() {
    if (document.querySelector("#projectsFixStyles")) return;
    const style = document.createElement("style");
    style.id = "projectsFixStyles";
    style.textContent = `
      .section-title{grid-template-columns:repeat(5,minmax(0,1fr))!important}
      .projects-toggle{min-height:38px;border:1px solid rgba(168,85,247,.32);border-radius:999px;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:0 10px;color:#fff;background:rgba(255,255,255,.065);cursor:pointer;font-size:.8rem;font-weight:900;box-shadow:inset 0 0 20px rgba(168,85,247,.05)}
      .projects-toggle:hover,.projects-toggle:active,.projects-toggle.is-open{background:rgba(168,85,247,.2);box-shadow:0 0 32px rgba(168,85,247,.42)}
      .projects-panel{padding:12px!important}
      .project-item{min-height:92px;border:1px solid rgba(168,85,247,.28);border-radius:20px;display:grid;gap:10px;padding:13px;background:linear-gradient(135deg,rgba(138,43,226,.14),rgba(168,85,247,.055)),rgba(255,255,255,.055);box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 12px 34px rgba(0,0,0,.22)}
      .project-title{display:flex;align-items:center;gap:9px;color:#fff;font-weight:950}.project-title i{width:34px;height:34px;border:1px solid rgba(216,180,254,.35);border-radius:13px;display:grid;place-items:center;color:#d8b4fe;background:rgba(168,85,247,.16);box-shadow:0 0 20px rgba(168,85,247,.24)}
      .project-desc{margin:0;color:#b8b8b8;font-size:.82rem;line-height:1.55}
      .project-actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.project-actions a,.project-actions button{min-height:38px;border:1px solid rgba(168,85,247,.3);border-radius:14px;display:inline-flex;align-items:center;justify-content:center;gap:7px;color:#fff;background:rgba(255,255,255,.06);cursor:pointer;font-size:.8rem;font-weight:900;text-decoration:none}
      .project-actions a:hover,.project-actions button:hover{background:rgba(168,85,247,.18);box-shadow:0 0 22px rgba(168,85,247,.24)}
      @media (max-width:520px){.section-title{grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:5px!important}.posts-toggle,.others-toggle,.notes-toggle,.tools-toggle,.projects-toggle{min-height:38px!important;padding:0 4px!important;font-size:.68rem!important;gap:4px}.projects-toggle i,.posts-toggle i,.others-toggle i,.notes-toggle i,.tools-toggle i{font-size:.85rem}.project-actions{grid-template-columns:1fr}.project-actions a,.project-actions button{justify-content:center}}
    `;
    document.head.appendChild(style);
  }

  function ensureButton() {
    const title = document.querySelector("#posts .section-title");
    if (!title || document.querySelector("#projectsToggle")) return;
    const button = document.createElement("button");
    button.className = "projects-toggle";
    button.id = "projectsToggle";
    button.type = "button";
    button.innerHTML = '<i class="fa-solid fa-folder-open"></i><span>Projects</span>';
    title.appendChild(button);
  }

  function ensurePanel() {
    if (document.querySelector('.tab-panel[data-panel="projects"] #projectsList')) return;
    let panel = document.querySelector('.tab-panel[data-panel="projects"]');
    if (!panel) {
      panel = document.createElement("div");
      panel.className = "tab-panel notes-panel projects-panel";
      panel.dataset.panel = "projects";
      panel.hidden = true;
      document.querySelector('.tab-panel[data-panel="tools"]')?.after(panel);
    }
    panel.className = "tab-panel notes-panel projects-panel";
    panel.innerHTML = '<div class="notes-head"><i class="fa-solid fa-folder-open"></i><strong>Projects</strong></div><div class="notes-list" id="projectsList"></div>';
  }

  function activate(panelName) {
    document.querySelectorAll(".tab-panel").forEach((panel) => {
      const active = panel.dataset.panel === panelName;
      panel.hidden = !active;
      panel.style.display = active ? "" : "none";
      panel.classList.toggle("is-active", active);
    });
    const buttons = { posts: "#postsToggle", skills: "#othersToggle", notes: "#notesToggle", tools: "#toolsToggle", projects: "#projectsToggle" };
    Object.entries(buttons).forEach(([name, selector]) => document.querySelector(selector)?.classList.toggle("is-open", name === panelName));
    document.body.classList.toggle("is-others-mode", panelName !== "posts");
  }

  function titleFromName(name) {
    return name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function uniqueBy(items, getKey) {
    const seen = new Set();
    return items.filter((item) => {
      const key = getKey(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function dedupeList(selector) {
    const list = document.querySelector(selector);
    if (!list) return;
    const seen = new Set();
    Array.from(list.children).forEach((item) => {
      const title = item.querySelector("strong")?.textContent?.trim().toLowerCase() || "";
      const link = item.querySelector("a[href]")?.href || item.querySelector(".project-download")?.dataset.download || "";
      const key = `${title}|${link}`;
      if (seen.has(key)) item.remove();
      else seen.add(key);
    });
  }

  function cdnUrl(path) {
    return `https://cdn.jsdelivr.net/gh/${REPO}@main/${path.split("/").map(encodeURIComponent).join("/")}`;
  }

  async function folderFiles(folder = PROJECTS_FOLDER) {
    try {
      const response = await fetch(`https://api.github.com/repos/${REPO}/contents/${folder}?t=${Date.now()}`, { cache: "no-store" });
      if (response.ok) {
        return (await response.json()).filter((file) => {
          const name = file.name.toLowerCase();
          return file.type === "file" && !file.name.startsWith(".") && !name.startsWith("readme.") && file.download_url;
        });
      }
    } catch {}

    try {
      const response = await fetch(`https://data.jsdelivr.com/v1/package/gh/${REPO}@main/flat?t=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) return [];
      const prefix = `/${folder}/`;
      return (await response.json()).files
        .filter((file) => file.name.startsWith(prefix))
        .map((file) => {
          const path = file.name.slice(1);
          const name = path.split("/").pop();
          return { name, path, type: "file", download_url: cdnUrl(path) };
        })
        .filter((file) => {
          const name = file.name.toLowerCase();
          return file.type === "file" && !file.name.startsWith(".") && !name.startsWith("readme.") && file.download_url;
        });
    } catch {
      return [];
    }
  }

  function parseProjectText(text, file) {
    const simpleProjects = simpleProjectLines(text, file);
    if (simpleProjects.length) return simpleProjects;

    const data = {};
    text.split(/\r?\n/).forEach((line) => {
      const match = line.match(/^\s*([a-z]+)\s*[:=]\s*(.+)\s*$/i);
      if (match) data[match[1].toLowerCase()] = match[2].trim();
    });
    return [{
      name: data.name || data.title || titleFromName(file.name),
      description: data.description || data.desc || "Project file ready for download.",
      download: normalizeDownloadUrl(data.download || data.src || data.link || file.download_url),
    }];
  }

  function projectTypeLabel(type) {
    const normalized = String(type || "").toLowerCase().replace(/[^a-z]/g, "");
    if (normalized === "app" || normalized === "apk") return "App";
    if (["src", "source", "sourcecode", "code"].includes(normalized)) return "Source Code";
    if (normalized === "zip") return "Zip";
    return type ? String(type).toUpperCase() : "Project";
  }

  function simpleProjectLines(text, file) {
    const base = titleFromName(file.name);
    return text.split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const typed = line.match(/^(app|apk|src|source|sourcecode|code|zip)\s*[:=-]?\s+(https?:\/\/\S+)$/i);
        if (typed) {
          const label = projectTypeLabel(typed[1]);
          return { name: `${base} ${label}`, description: `${label} direct download.`, download: normalizeDownloadUrl(typed[2]) };
        }
        const direct = line.match(/^(https?:\/\/\S+)$/i);
        if (direct) return { name: base, description: "Project direct download.", download: normalizeDownloadUrl(direct[1]) };
        return null;
      })
      .filter(Boolean);
  }

  async function projectFromFile(file) {
    if (/\.(txt|md|json)$/i.test(file.name)) {
      try {
        const response = await fetch(file.download_url, { cache: "no-store" });
        if (response.ok) {
          if (/\.json$/i.test(file.name)) {
            const data = await response.json();
            const makeProject = (entry, index = 0) => ({
              name: entry.name || entry.title || `${titleFromName(file.name)}${index ? ` ${index + 1}` : ""}`,
              description: entry.description || entry.desc || "Project file ready for download.",
              download: normalizeDownloadUrl(entry.download || entry.src || entry.link || file.download_url),
            });
            return Array.isArray(data) ? data.map(makeProject) : [makeProject(data)];
          }
          return parseProjectText(await response.text(), file);
        }
      } catch {}
    }
    return [{ name: titleFromName(file.name), description: "Project file ready for download.", download: normalizeDownloadUrl(file.download_url) }];
  }

  async function shareProject(project) {
    const url = `${location.origin}${location.pathname}?project=${encodeURIComponent(project.name)}#projects`;
    const data = { title: project.name, text: `${project.name} download yahan milega.`, url };
    if (navigator.share) {
      try { await navigator.share(data); return; } catch { return; }
    }
    await navigator.clipboard.writeText(url);
    const toast = document.querySelector("#toast");
    if (toast) { toast.textContent = "Project website link copied."; toast.classList.add("show"); }
  }

  async function shareFile(file, folder) {
    const url = `${location.origin}${location.pathname}?${folder}=${encodeURIComponent(file.name)}#${folder}`;
    const data = { title: titleFromName(file.name), text: `${titleFromName(file.name)} yahan open/download kar sakte ho.`, url };
    if (navigator.share) {
      try { await navigator.share(data); return; } catch { return; }
    }
    await navigator.clipboard.writeText(url);
    const toast = document.querySelector("#toast");
    if (toast) { toast.textContent = `${titleFromName(folder)} link copied.`; toast.classList.add("show"); }
  }

  function filenameFromProject(project) {
    try {
      const path = new URL(project.download, location.href).pathname;
      const file = decodeURIComponent(path.split("/").filter(Boolean).pop() || "");
      if (file && file.includes(".")) return file;
    } catch {}
    return `${(project.name || "project").replace(/[^\w.-]+/g, "-").replace(/^-+|-+$/g, "") || "project"}.zip`;
  }

  function normalizeDownloadUrl(url) {
    if (!url) return "";
    const trimmed = url.trim();
    try {
      const parsed = new URL(trimmed, location.href);
      if (parsed.hostname === "github.com" && parsed.pathname.includes("/blob/")) {
        const parts = parsed.pathname.split("/").filter(Boolean);
        const owner = parts[0];
        const repo = parts[1];
        const branchIndex = parts.indexOf("blob") + 1;
        const branch = parts[branchIndex];
        const filePath = parts.slice(branchIndex + 1).map(encodeURIComponent).join("/");
        return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
      }
      if (parsed.hostname === "github.com" && parsed.pathname.includes("/raw/")) return trimmed;
      if (parsed.hostname.endsWith("dropbox.com")) { parsed.searchParams.set("dl", "1"); return parsed.toString(); }
      if (parsed.hostname.includes("drive.google.com")) {
        const fileMatch = parsed.pathname.match(/\/file\/d\/([^/]+)/);
        const id = fileMatch?.[1] || parsed.searchParams.get("id");
        if (id) return `https://drive.google.com/uc?export=download&id=${encodeURIComponent(id)}`;
      }
      return trimmed;
    } catch { return trimmed; }
  }

  function clickDownloadUrl(url, filename) {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.rel = "noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async function directDownloadProject(project) {
    const url = project.download;
    if (!url || url === "#") return;
    const filename = filenameFromProject(project);
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      if (!blob.size) throw new Error("Empty file");
      const objectUrl = URL.createObjectURL(blob);
      clickDownloadUrl(objectUrl, filename);
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      return;
    } catch {
      clickDownloadUrl(url, filename);
    }
  }

  function renderProject(project) {
    const item = document.createElement("article");
    item.className = "project-item";
    item.innerHTML = `
      <div class="project-title"><i class="fa-solid fa-folder-open"></i><strong></strong></div>
      <p class="project-desc"></p>
      <div class="project-actions">
        <a class="project-open" href="#projects"><i class="fa-solid fa-eye"></i><span>Open</span></a>
        <button class="project-download" type="button"><i class="fa-solid fa-download"></i><span>Download</span></button>
        <button class="project-share" type="button"><i class="fa-solid fa-share-nodes"></i><span>Share</span></button>
      </div>
    `;
    item.querySelector("strong").textContent = project.name;
    item.querySelector(".project-desc").textContent = project.description;
    item.querySelector(".project-download").dataset.download = project.download || "";
    item.querySelector(".project-open").addEventListener("click", (event) => {
      event.preventDefault();
      item.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    item.querySelector(".project-download").addEventListener("click", () => directDownloadProject(project));
    item.querySelector(".project-share").addEventListener("click", () => shareProject(project));
    return item;
  }

  async function loadProjects() {
    const list = document.querySelector("#projectsList");
    if (!list) return;
    list.innerHTML = "";
    const projects = (await Promise.all((await folderFiles()).map(projectFromFile))).flat();
    uniqueBy(projects, (project) => `${project.name}|${project.download}`).forEach((project) => list.appendChild(renderProject(project)));
    dedupeList("#projectsList");
  }

  function renderSimpleItem(file, folder) {
    const item = document.createElement("article");
    item.className = "note-item";
    item.innerHTML = `
      <strong></strong>
      <div class="note-actions">
        <button type="button"><i class="fa-solid fa-eye"></i><span>Open</span></button>
        <a href="${file.download_url}" download="${file.name}"><i class="fa-solid fa-download"></i><span>Download</span></a>
        <button class="file-share" type="button"><i class="fa-solid fa-share-nodes"></i><span>Share</span></button>
      </div>
    `;
    item.querySelector("strong").textContent = titleFromName(file.name);
    item.querySelector(".file-share").addEventListener("click", () => shareFile(file, folder));
    return item;
  }

  async function loadSimpleFolder(folder, selector) {
    const list = document.querySelector(selector);
    if (!list) return;
    list.innerHTML = "";
    const files = await folderFiles(folder);
    uniqueBy(files, (file) => `${file.name}|${file.download_url}`).forEach((file) => list.appendChild(renderSimpleItem(file, folder)));
    dedupeList(selector);
  }

  function bind() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest("#projectsToggle");
      if (!button) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      activate("projects");
      loadProjects();
    }, true);
  }

  function init() {
    addStyles();
    ensureButton();
    ensurePanel();
    bind();
    loadSimpleFolder("notes", "#notesList");
    loadSimpleFolder("tools", "#toolsList");
    loadProjects();
    if (new URLSearchParams(location.search).has("project") || location.hash === "#projects") activate("projects");
    ["#notesList", "#toolsList", "#projectsList"].forEach((selector) => {
      const list = document.querySelector(selector);
      if (!list) return;
      new MutationObserver(() => dedupeList(selector)).observe(list, { childList: true });
    });
    window.setTimeout(() => {
      dedupeList("#notesList");
      dedupeList("#toolsList");
      dedupeList("#projectsList");
    }, 1500);
  }

  if (document.readyState === "loading") window.addEventListener("DOMContentLoaded", init);
  else init();
})();
