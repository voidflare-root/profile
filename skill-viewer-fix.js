(() => {
  const REPO = window.PORTFOLIO_REPO || "voidflare-root/profile";
  const $ = (selector, root = document) => root.querySelector(selector);
  const skillFiles = {
    "Android Development": "android-development.txt",
    Kotlin: "kotlin.txt",
    Python: "python.txt",
    "Web Development": "web-development.txt",
    Java: "java.txt",
    HTML: "html.txt",
    CSS: "css.txt",
    Coding: "coding.txt",
    Hacking: "hacking.txt",
    "AI Tools": "ai-tools.txt",
    "Telegram Bots": "telegram-bots.txt",
  };

  function cdnUrl(path) {
    return `https://cdn.jsdelivr.net/gh/${REPO}@main/${path.split("/").map(encodeURIComponent).join("/")}`;
  }

  function ensureViewer() {
    let modal = $("#skillViewerModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "skillViewerModal";
      modal.className = "skill-viewer-modal";
      modal.setAttribute("aria-hidden", "true");
      modal.innerHTML = `<div class="skill-viewer-card"><div class="skill-viewer-bar"><strong id="skillViewerTitle">Skill</strong><button type="button" id="skillViewerClose" aria-label="Close skill"><i class="fa-solid fa-xmark"></i></button></div><div class="skill-viewer-body" id="skillViewerBody">Loading...</div></div>`;
      document.body.appendChild(modal);
    }
    if (!$("#skillViewerStyles")) {
      const style = document.createElement("style");
      style.id = "skillViewerStyles";
      style.textContent = `.skill-viewer-modal{position:fixed;inset:0;z-index:92;display:none;place-items:center;padding:16px;background:rgba(0,0,0,.86);backdrop-filter:blur(18px)}.skill-viewer-modal.is-open{display:grid}.skill-viewer-card{width:min(560px,100%);max-height:min(78vh,720px);display:grid;grid-template-rows:auto 1fr;border:1px solid rgba(168,85,247,.38);border-radius:24px;background:linear-gradient(145deg,rgba(255,255,255,.12),rgba(255,255,255,.045)),#05050a;box-shadow:0 0 70px rgba(168,85,247,.34),0 24px 80px rgba(0,0,0,.55);overflow:hidden}.skill-viewer-bar{min-height:58px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;border-bottom:1px solid rgba(168,85,247,.24);background:rgba(255,255,255,.06)}.skill-viewer-bar strong{color:#fff;font-size:1rem;font-weight:950;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.skill-viewer-bar button{width:40px;height:40px;border:1px solid rgba(168,85,247,.32);border-radius:999px;display:grid;place-items:center;color:#fff;background:rgba(255,255,255,.075);cursor:pointer}.skill-viewer-body{overflow:auto;padding:16px;color:#e9ddff;font-size:.92rem;font-weight:750;line-height:1.7;white-space:pre-line}`;
      document.head.appendChild(style);
    }
    $("#skillViewerClose")?.addEventListener("click", closeViewer);
    modal.addEventListener("click", (event) => {
      if (event.target.id === "skillViewerModal") closeViewer();
    });
    return modal;
  }

  async function openViewer(label) {
    const file = skillFiles[label];
    if (!file) return;
    const modal = ensureViewer();
    $("#skillViewerTitle").textContent = label;
    $("#skillViewerBody").textContent = "Loading...";
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    try {
      let response = await fetch(`skills/${file}?t=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) response = await fetch(cdnUrl(`skills/${file}`) + `?t=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Missing skill file");
      const text = (await response.text()).trim();
      $("#skillViewerBody").textContent = text || `${label} ke bare me content skills folder me add karo.`;
    } catch {
      $("#skillViewerBody").textContent = `${label} file skills folder me nahi mil raha.`;
    }
  }

  function closeViewer() {
    const modal = $("#skillViewerModal");
    modal?.classList.remove("is-open");
    modal?.setAttribute("aria-hidden", "true");
  }

  function bind() {
    if (document.body.dataset.skillViewerFixBound === "1") return;
    document.body.dataset.skillViewerFixBound = "1";
    document.addEventListener("click", (event) => {
      const card = event.target.closest('.tab-panel[data-panel="skills"] article,[data-skill-file]');
      if (!card) return;
      const label = card.dataset.skillTitle || card.querySelector("strong")?.textContent?.trim() || card.textContent.trim();
      if (!label || !skillFiles[label]) return;
      event.preventDefault();
      event.stopPropagation();
      openViewer(label);
    }, true);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeViewer();
    });
  }

  if (document.readyState === "loading") window.addEventListener("DOMContentLoaded", bind);
  else bind();
})();

(() => {
  if (document.querySelector('script[src*="direct-share-fix.js"]')) return;
  const script = document.createElement("script");
  script.src = "direct-share-fix.js?v=1";
  document.body.appendChild(script);
})();
