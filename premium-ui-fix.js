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

  function injectFinalStyles() {
    document.querySelector("#premiumUiStyles")?.remove();
    const style = document.createElement("style");
    style.id = "premiumUiStyles";
    style.textContent = `
      body{background:radial-gradient(circle at 16% -8%,rgba(168,85,247,.34),transparent 36%),radial-gradient(circle at 92% 12%,rgba(34,197,94,.12),transparent 28%),radial-gradient(circle at 50% 112%,rgba(138,43,226,.22),transparent 34%),#030306!important}.app-shell{animation:premiumEnter .55s ease both}.profile-card,.posts-section,.stories-section,.glass-card{border-color:rgba(190,132,255,.38)!important;background:linear-gradient(145deg,rgba(255,255,255,.105),rgba(255,255,255,.035))!important;box-shadow:0 24px 90px rgba(0,0,0,.48),0 0 42px rgba(168,85,247,.16),inset 0 1px 0 rgba(255,255,255,.12)!important}.dp-ring{background:conic-gradient(from 180deg,#8a2be2,#d8b4fe,#fff,#a855f7,#8a2be2)!important;box-shadow:0 0 26px rgba(168,85,247,.72),0 0 70px rgba(168,85,247,.28)!important;animation:premiumPulse 3.2s ease-in-out infinite}.name-stack>span{display:inline-flex!important;width:max-content;max-width:100%;padding:5px 10px;border:1px solid rgba(168,85,247,.32);border-radius:999px;background:rgba(168,85,247,.12);font-size:.72rem!important}h1{background:linear-gradient(180deg,#fff,#e8d5ff 45%,#a855f7);-webkit-background-clip:text;background-clip:text;color:transparent!important;text-shadow:0 0 28px rgba(168,85,247,.34)!important}
      .instagram-link,.song-button,.action-row button,.action-row a,.role-boxes span,.social-name-row a,.posts-toggle,.others-toggle,.notes-toggle,.tools-toggle,.tab-card-grid article,.tab-list a,.note-item,.contact-options a{border-color:rgba(190,132,255,.34)!important;background:linear-gradient(145deg,rgba(255,255,255,.12),rgba(255,255,255,.045))!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.1),0 10px 28px rgba(0,0,0,.18)!important}.action-row button:hover,.action-row a:hover,.posts-toggle.is-open,.others-toggle.is-open,.notes-toggle.is-open,.tools-toggle.is-open{border-color:rgba(216,180,254,.64)!important;background:linear-gradient(145deg,rgba(168,85,247,.28),rgba(255,255,255,.07))!important;box-shadow:0 0 32px rgba(168,85,247,.42),inset 0 1px 0 rgba(255,255,255,.14)!important}.action-row a[href*="wa.me"]{background:linear-gradient(145deg,rgba(37,211,102,.22),rgba(168,85,247,.08))!important;border-color:rgba(37,211,102,.55)!important}.bio{border-color:rgba(216,180,254,.34)!important;background:linear-gradient(135deg,rgba(168,85,247,.22),rgba(255,255,255,.055))!important}.post-card,.story-item{border:1px solid rgba(216,180,254,.2)!important;border-radius:20px!important;background:#080810!important;box-shadow:0 14px 40px rgba(0,0,0,.32),0 0 24px rgba(168,85,247,.1),inset 0 1px 0 rgba(255,255,255,.08)!important}.post-card:hover,.story-item:hover,.tab-card-grid article:hover,.note-item:hover{transform:translateY(-2px);border-color:rgba(216,180,254,.5)!important;box-shadow:0 0 32px rgba(168,85,247,.26),inset 0 1px 0 rgba(255,255,255,.14)!important}
      .info-section{display:none!important}.tab-panel[hidden]{display:none!important}body.is-others-mode .stories-section{display:none!important}.notes-list:empty{display:none!important}#noteClose,#noteCanvasClose{display:none!important}.section-title{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr));align-items:center;gap:8px}.notes-panel{padding:12px}.notes-list{display:grid;gap:10px}.note-item{min-height:74px;border:1px solid rgba(168,85,247,.24);border-radius:18px;display:grid;gap:10px;padding:12px}.note-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.note-actions a,.note-actions button{min-height:38px;border:1px solid rgba(168,85,247,.28);border-radius:14px;display:inline-flex;align-items:center;justify-content:center;gap:8px;color:#fff;background:rgba(255,255,255,.06);cursor:pointer;font-size:.82rem;font-weight:900;text-decoration:none}
      .tab-panel[data-panel="skills"]{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:10px!important;padding:12px!important}.tab-panel[data-panel="skills"] article{position:relative;min-height:116px!important;border:1px solid rgba(216,180,254,.34)!important;border-radius:22px!important;display:grid!important;place-items:center!important;align-content:center!important;gap:10px!important;padding:14px 8px!important;text-align:center!important;background:radial-gradient(circle at 50% 0,rgba(216,180,254,.18),transparent 46%),linear-gradient(145deg,rgba(168,85,247,.18),rgba(255,255,255,.045))!important}.tab-panel[data-panel="skills"] article i{width:42px;height:42px;border:1px solid rgba(216,180,254,.38);border-radius:16px;display:grid;place-items:center;color:#fff!important;background:rgba(168,85,247,.2);font-size:1.35rem!important;box-shadow:0 0 26px rgba(168,85,247,.34)}.tab-panel[data-panel="skills"] article strong{font-size:.78rem!important;line-height:1.2!important;overflow-wrap:anywhere}
      @media (max-width:1023px){.app-shell{width:min(100%,980px)!important;display:block!important;margin:0 auto!important}.profile-card,.posts-section,.stories-section,.info-section{width:min(720px,100%)!important;margin-left:auto!important;margin-right:auto!important}.posts-section,.stories-section,.info-section{margin-top:16px!important}}@media (min-width:1024px){.app-shell{width:min(1120px,calc(100% - 48px))!important;display:grid!important;grid-template-columns:minmax(360px,430px) minmax(0,1fr)!important;gap:22px!important;align-items:start!important}.profile-card{position:sticky!important;top:22px!important;width:100%!important;margin:0!important;grid-column:1!important;grid-row:1 / span 8!important}.posts-section,.stories-section,.info-section{width:100%!important;grid-column:2!important}.posts-section{margin-top:0!important}}@media (max-width:520px){.app-shell{padding:12px 10px 42px!important}.profile-card{padding:16px!important;border-radius:26px!important}.section-title{gap:7px!important;padding:13px!important}.posts-toggle,.others-toggle,.notes-toggle,.tools-toggle{min-height:40px!important;padding:0 7px!important;font-size:.76rem!important}.post-grid,.story-grid,.tab-card-grid{gap:7px!important;padding:8px!important}}
      @keyframes premiumEnter{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}@keyframes premiumPulse{0%,100%{box-shadow:0 0 26px rgba(168,85,247,.72),0 0 70px rgba(168,85,247,.28)}50%{box-shadow:0 0 34px rgba(216,180,254,.86),0 0 88px rgba(168,85,247,.38)}}
    `;
    document.head.appendChild(style);
  }

  function formatTitle(name) {
    return name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  async function getFolderFiles(folder) {
    try {
      const response = await fetch(`https://api.github.com/repos/${REPO}/contents/${folder}?t=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) return [];
      const files = await response.json();
      return files.filter((file) => file.type === "file" && !file.name.startsWith(".") && file.download_url);
    } catch {
      return [];
    }
  }

  function renderFolder(folder, selector) {
    const list = document.querySelector(selector);
    if (!list) return;
    list.innerHTML = "";
    getFolderFiles(folder).then((files) => {
      list.innerHTML = "";
      files.forEach((file) => {
        const item = document.createElement("article");
        item.className = "note-item";
        const title = document.createElement("strong");
        title.textContent = formatTitle(file.name);
        const actions = document.createElement("div");
        actions.className = "note-actions";
        const open = document.createElement("button");
        open.type = "button";
        open.innerHTML = '<i class="fa-solid fa-eye"></i><span>Open</span>';
        const download = document.createElement("a");
        download.href = file.download_url;
        download.download = file.name;
        download.innerHTML = '<i class="fa-solid fa-download"></i><span>Download</span>';
        actions.append(open, download);
        item.append(title, actions);
        list.appendChild(item);
      });
    });
  }

  function ensureSkills() {
    const panel = document.querySelector('.tab-panel[data-panel="skills"]');
    if (!panel) return;
    const hasData = panel.querySelectorAll('[data-skill-file]').length >= SKILLS.length;
    if (hasData) return;
    panel.classList.add("tab-card-grid");
    panel.innerHTML = SKILLS.map(([icon, label, file]) => `<article role="button" tabindex="0" data-skill-file="${file}" data-skill-title="${label}" data-skill-icon="${icon}"><i class="${icon}"></i><strong>${label}</strong></article>`).join("");
  }

  function activatePanel(panelName) {
    document.querySelectorAll(".tab-panel").forEach((panel) => {
      const active = panel.dataset.panel === panelName;
      panel.hidden = !active;
      panel.style.display = active ? "" : "none";
      panel.classList.toggle("is-active", active);
    });
    const activeButton = { posts: "#postsToggle", skills: "#othersToggle", notes: "#notesToggle", tools: "#toolsToggle" }[panelName];
    ["#postsToggle", "#othersToggle", "#notesToggle", "#toolsToggle"].forEach((selector) => document.querySelector(selector)?.classList.toggle("is-open", selector === activeButton));
    document.body.classList.toggle("is-others-mode", panelName !== "posts");
  }

  function normalize() {
    injectFinalStyles();
    ensureSkills();
    renderFolder("notes", "#notesList");
    renderFolder("tools", "#toolsList");
    if (!document.querySelector(".tab-panel.is-active")) activatePanel("posts");
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest("#postsToggle,#othersToggle,#notesToggle,#toolsToggle");
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    activatePanel(button.id === "postsToggle" ? "posts" : button.id === "othersToggle" ? "skills" : button.id === "notesToggle" ? "notes" : "tools");
  }, true);

  if (document.readyState === "loading") window.addEventListener("DOMContentLoaded", normalize); else normalize();
  window.addEventListener("load", () => {
    normalize();
    window.setTimeout(ensureSkills, 500);
    window.setTimeout(ensureSkills, 1200);
  });
})();
