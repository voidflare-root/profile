(() => {
  const REPO = window.PORTFOLIO_REPO || "voidflare-root/profile";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const title = (name) => name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

  function unique(items, keyFn) {
    const seen = new Set();
    return items.filter((item) => {
      const key = keyFn(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function cdnUrl(path) {
    return `https://cdn.jsdelivr.net/gh/${REPO}@main/${path.split("/").map(encodeURIComponent).join("/")}`;
  }

  async function folderFiles(folder) {
    const allFiles = [];
    try {
      const manifest = await fetch(cdnUrl(`${folder}/index.json`) + `?t=${Date.now()}`, { cache: "no-store" });
      if (manifest.ok) {
        const entries = await manifest.json();
        const paths = Array.isArray(entries) ? entries : entries.files;
        if (Array.isArray(paths)) {
          allFiles.push(...paths.map((entry) => {
            const path = typeof entry === "string" ? entry : entry.path;
            const label = typeof entry === "string" ? "" : entry.name;
            return { name: label || path.split("/").pop(), path, type: "file", download_url: cdnUrl(path) };
          }).filter((file) => file.path && !file.name.startsWith(".") && !file.name.toLowerCase().startsWith("readme.")));
        }
      }
    } catch {}
    try {
      const flat = await fetch(`https://data.jsdelivr.com/v1/package/gh/${REPO}@main/flat?t=${Date.now()}`, { cache: "no-store" });
      if (flat.ok) {
        const files = (await flat.json()).files
          .filter((file) => file.name.startsWith(`/${folder}/`))
          .map((file) => {
            const path = file.name.slice(1);
            return { name: path.split("/").pop(), path, type: "file", download_url: cdnUrl(path) };
          })
          .filter((file) => !file.name.startsWith(".") && !file.name.toLowerCase().startsWith("readme."));
        allFiles.push(...files);
      }
    } catch {}
    try {
      const api = await fetch(`https://api.github.com/repos/${REPO}/contents/${folder}?t=${Date.now()}`, { cache: "no-store" });
      if (api.ok) {
        const files = (await api.json()).filter((file) => file.type === "file" && file.download_url && !file.name.startsWith(".") && !file.name.toLowerCase().startsWith("readme."));
        allFiles.push(...files);
      }
    } catch {}
    return unique(allFiles, (file) => `${file.name}|${file.path || file.download_url}`);
  }

  function normalizeUrl(url) {
    if (!url) return "";
    try {
      const parsed = new URL(url.trim(), location.href);
      if (parsed.hostname === "github.com" && parsed.pathname.includes("/blob/")) {
        const parts = parsed.pathname.split("/").filter(Boolean);
        const branchIndex = parts.indexOf("blob") + 1;
        return `https://raw.githubusercontent.com/${parts[0]}/${parts[1]}/${parts[branchIndex]}/${parts.slice(branchIndex + 1).map(encodeURIComponent).join("/")}`;
      }
      return parsed.toString();
    } catch {
      return url.trim();
    }
  }

  function parseProjectFile(text, file) {
    const base = title(file.name);
    const meta = {};
    text.split(/\r?\n/).forEach((line) => {
      const match = line.trim().match(/^(name|title|description|desc|download|url|link)\s*:\s*(.+)$/i);
      if (match) meta[match[1].toLowerCase()] = match[2].trim();
    });
    const metaUrl = meta.download || meta.url || meta.link;
    if (metaUrl) {
      return [{
        name: meta.name || meta.title || base,
        description: meta.description || meta.desc || "Project direct download.",
        download: normalizeUrl(metaUrl),
        type: /\.apk(?:$|[?#])/i.test(metaUrl) ? "app" : /\.zip(?:$|[?#])/i.test(metaUrl) ? "zip" : "",
      }];
    }
    const projects = text.split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const typed = line.match(/^(app|apk|src|source|sourcecode|code|zip)\s*[:=-]?\s+(https?:\/\/\S+)$/i);
        if (typed) {
          const type = typed[1].toLowerCase().replace(/[^a-z]/g, "");
          const label = type === "app" || type === "apk" ? "App" : ["src", "source", "sourcecode", "code"].includes(type) ? "Source Code" : type === "zip" ? "Zip" : "Project";
          return { name: `${base} ${label}`, description: `${label} direct download.`, download: normalizeUrl(typed[2]), type };
        }
        const direct = line.match(/^(https?:\/\/\S+)$/i);
        return direct ? { name: base, description: "Project direct download.", download: normalizeUrl(direct[1]), type: "" } : null;
      })
      .filter(Boolean);
    return projects.length ? projects : [{ name: base, description: "Project file ready for download.", download: normalizeUrl(file.download_url), type: "" }];
  }

  async function projectFromFile(file) {
    if (!/\.(apk|zip|rar|7z|png|jpe?g|webp|gif|mp4|mp3)$/i.test(file.name)) {
      try {
        const response = await fetch(file.download_url, { cache: "no-store" });
        if (response.ok) {
          const text = await response.text();
          if (/https?:\/\//i.test(text) || /^(name|title|description|desc|download|url|link|app|apk|src|source|zip)\s*[:=-]/im.test(text)) return parseProjectFile(text, file);
        }
      } catch {}
    }
    return [{ name: title(file.name), description: "Project file ready for download.", download: normalizeUrl(file.download_url), type: "" }];
  }

  function isOpenable(project) {
    const type = String(project.type || "").toLowerCase().replace(/[^a-z]/g, "");
    if (["src", "source", "sourcecode", "code", "zip"].includes(type)) return true;
    try { return new URL(project.download, location.href).pathname.toLowerCase().endsWith(".zip"); }
    catch { return /\.zip(?:$|[?#])/i.test(project.download || ""); }
  }

  function filenameFrom(url, fallback) {
    try {
      const file = decodeURIComponent(new URL(url, location.href).pathname.split("/").filter(Boolean).pop() || "");
      if (file && file.includes(".")) return file;
    } catch {}
    return fallback.replace(/[^\w.-]+/g, "-") || "download";
  }

  function directDownload(url, name) {
    const link = document.createElement("a");
    link.href = url;
    link.download = filenameFrom(url, name);
    link.rel = "noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async function share(label, url) {
    if (navigator.share) {
      try { await navigator.share({ title: label, url }); return; } catch { return; }
    }
    await navigator.clipboard.writeText(url);
    const toast = $("#toast");
    if (toast) {
      toast.textContent = "Website link copied.";
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 1800);
    }
  }

  function renderProject(project) {
    const item = document.createElement("article");
    const open = isOpenable(project);
    item.className = "project-item";
    item.innerHTML = `<div class="project-title"><i class="fa-solid fa-folder-open"></i><strong></strong></div><p class="project-desc"></p><div class="project-actions ${open ? "" : "no-open"}">${open ? '<a class="project-open" href="#projects"><i class="fa-solid fa-eye"></i><span>Open</span></a>' : ""}<button class="project-download" type="button"><i class="fa-solid fa-download"></i><span>Download</span></button><button class="project-share" type="button"><i class="fa-solid fa-share-nodes"></i><span>Share</span></button></div>`;
    $("strong", item).textContent = project.name;
    $(".project-desc", item).textContent = project.description;
    $(".project-download", item).dataset.download = project.download;
    $(".project-open", item)?.addEventListener("click", (event) => { event.preventDefault(); directDownload(project.download, project.name); });
    $(".project-download", item).addEventListener("click", () => directDownload(project.download, project.name));
    $(".project-share", item).addEventListener("click", () => share(project.name, `${location.origin}${location.pathname}?project=${encodeURIComponent(project.name)}#projects`));
    return item;
  }

  async function loadProjects() {
    const list = $("#projectsList");
    if (!list) return;
    const projects = unique((await Promise.all((await folderFiles("projects")).map(projectFromFile))).flat(), (p) => `${p.name}|${p.download}`);
    if (!projects.length) { list.innerHTML = '<p class="empty-state">Projects folder me file add karo.</p>'; return; }
    list.replaceChildren(...projects.map((project) => renderProject(project)));
  }

  function renderFolderFile(file, folder) {
    const item = document.createElement("article");
    const label = title(file.name);
    item.className = "note-item";
    item.innerHTML = `<strong></strong><div class="note-actions"><button type="button"><i class="fa-solid fa-eye"></i><span>Open</span></button><a href="${file.download_url}" download="${file.name}"><i class="fa-solid fa-download"></i><span>Download</span></a><button class="file-share" type="button"><i class="fa-solid fa-share-nodes"></i><span>Share</span></button></div>`;
    $("strong", item).textContent = label;
    $(".file-share", item).addEventListener("click", () => share(label, `${location.origin}${location.pathname}?${folder}=${encodeURIComponent(file.name)}#${folder}`));
    return item;
  }

  async function loadFolder(folder, selector) {
    const list = $(selector);
    if (!list) return;
    const files = unique(await folderFiles(folder), (file) => `${file.name}|${file.path || file.download_url}`);
    if (!files.length) { list.innerHTML = `<p class="empty-state">${folder} folder me file add karo.</p>`; return; }
    list.replaceChildren(...files.map((file) => renderFolderFile(file, folder)));
  }

  function activate(panel) {
    $$(".tab-panel").forEach((item) => {
      const active = item.dataset.panel === panel;
      item.hidden = !active;
      item.style.display = active ? "" : "none";
      item.classList.toggle("is-active", active);
    });
    Object.entries({ posts: "#postsToggle", skills: "#othersToggle", notes: "#notesToggle", tools: "#toolsToggle", projects: "#projectsToggle" }).forEach(([name, selector]) => $(selector)?.classList.toggle("is-open", name === panel));
    document.body.classList.toggle("is-others-mode", panel !== "posts");
    if (panel === "notes") loadFolder("notes", "#notesList");
    if (panel === "tools") loadFolder("tools", "#toolsList");
    if (panel === "projects") loadProjects();
  }

  function bindTabs() {
    if (document.body.dataset.finalTabsBound === "1") return;
    document.body.dataset.finalTabsBound = "1";
    const handleTabClick = (event) => {
      const button = event.target.closest("#postsToggle,#othersToggle,#notesToggle,#toolsToggle,#projectsToggle");
      if (!button) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      activate(button.id === "postsToggle" ? "posts" : button.id === "othersToggle" ? "skills" : button.id === "notesToggle" ? "notes" : button.id === "toolsToggle" ? "tools" : "projects");
    };
    window.addEventListener("click", handleTabClick, true);
    document.addEventListener("click", handleTabClick, true);
  }

  function init() {
    bindTabs();
    loadFolder("notes", "#notesList");
    loadFolder("tools", "#toolsList");
    loadProjects();
    activate(new URLSearchParams(location.search).has("project") || location.hash === "#projects" ? "projects" : "posts");
    [900, 2600].forEach((delay) => setTimeout(() => {
      const active = $(".tab-panel.is-active")?.dataset.panel || "posts";
      loadFolder("notes", "#notesList");
      loadFolder("tools", "#toolsList");
      loadProjects();
      activate(active);
    }, delay));
    document.body.classList.add("ui-ready");
  }

  if (document.readyState === "loading") window.addEventListener("DOMContentLoaded", init);
  else init();
  window.addEventListener("load", () => setTimeout(init, 250));
})();
