(() => {
  const skills = [
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
  const fallbackSkillText = new Map([
    ["android-development.txt", "Android Development\n\nAndroid Development me mobile apps banana, UI design karna, app screens connect karna, data handle karna aur final APK ready karna aata hai.\n\nMain Android apps ko clean design, fast performance aur user-friendly flow ke sath banana seekh raha hoon."],
    ["kotlin.txt", "Kotlin\n\nKotlin Android app development ke liye modern programming language hai. Isse clean code, app logic, button actions, API connection aur Android features build kiye ja sakte hain.\n\nKotlin developer ke liye strong skill hai kyunki Android Studio me iska use bahut hota hai."],
    ["python.txt", "Python\n\nPython automation, bots, AI tools, scripts aur backend logic ke liye powerful language hai.\n\nIsse Telegram bots, file tools, web scraping, AI projects aur daily task automation bana sakte hain."],
    ["web-development.txt", "Web Development\n\nWeb Development me websites aur web apps banana aata hai. Isme frontend UI, responsive layout, buttons, forms, animations aur hosting ka kaam hota hai.\n\nHTML, CSS aur JavaScript milkar ek complete website banate hain."],
    ["java.txt", "Java\n\nJava ek strong programming language hai jo Android, backend, desktop software aur object-oriented programming ke liye use hoti hai.\n\nJava se coding logic, classes, objects, loops, conditions aur app structure ko samajhne me help milti hai."],
    ["html.txt", "HTML\n\nHTML website ka structure banata hai. Page ke headings, text, images, buttons, links, forms aur sections HTML se define hote hain.\n\nHTML web development ki basic aur important skill hai."],
    ["css.txt", "CSS\n\nCSS website ko style deta hai. Colors, layout, spacing, responsive design, animation, glassmorphism aur premium UI CSS se banaya jata hai.\n\nCSS ke bina website plain dikhti hai, CSS se website attractive banti hai."],
    ["coding.txt", "Coding\n\nCoding ka matlab problems ko logic se solve karna aur computer ko step-by-step instructions dena hai.\n\nCoding me practice, debugging, clean structure aur naye ideas ko real project me convert karna important hota hai."],
    ["hacking.txt", "Hacking\n\nHacking skill ka focus ethical learning, cyber security, system understanding, privacy aur protection par hona chahiye.\n\nEthical hacking me vulnerabilities ko samajhkar systems ko secure banana important hota hai. Iska use hamesha legal aur safe purpose ke liye hona chahiye."],
    ["ai-tools.txt", "AI Tools\n\nAI Tools se smart automation, content generation, code help, image generation, chatbots aur productivity systems banaye ja sakte hain.\n\nAI Creator ke liye prompt writing, workflow design aur tools ko project me use karna important skill hai."],
    ["telegram-bots.txt", "Telegram Bots\n\nTelegram Bot Development me auto reply, commands, admin panel, file handling, user support aur automation features banaye ja sakte hain.\n\nPython aur Telegram Bot API ke sath powerful bots build kiye ja sakte hain."],
  ]);

  const keyFor = (type, raw) => `${type}:${raw || type}`;
  const likedKey = (key) => `hexghost-liked:${key}`;
  const countKey = (key) => `hexghost-like-count:${key}`;
  const liked = (key) => localStorage.getItem(likedKey(key)) === "1";

  function countFor(key) {
    const saved = Number.parseInt(localStorage.getItem(countKey(key)) || "", 10);
    if (Number.isFinite(saved)) return saved;
    let seed = 24;
    for (const char of key) seed = (seed + char.charCodeAt(0)) % 92;
    return seed + 8;
  }

  function setButton(button, key) {
    button.classList.toggle("is-liked", liked(key));
    const count = button.querySelector(".like-count");
    if (count) count.textContent = countFor(key);
  }

  function refresh(key) {
    document.querySelectorAll(`[data-like-key="${CSS.escape(key)}"]`).forEach((button) => setButton(button, key));
  }

  function toggle(key) {
    const next = !liked(key);
    localStorage.setItem(likedKey(key), next ? "1" : "0");
    localStorage.setItem(countKey(key), String(Math.max(0, countFor(key) + (next ? 1 : -1))));
    refresh(key);
  }

  function addStyle() {
    if (document.querySelector("#likesSkillsStyles")) return;
    const style = document.createElement("style");
    style.id = "likesSkillsStyles";
    style.textContent = `
      .action-row a[href*="wa.me"]{min-width:0;background:radial-gradient(circle at 15% 0%,rgba(34,197,94,.34),transparent 34%),linear-gradient(135deg,rgba(37,211,102,.24),rgba(168,85,247,.08)),rgba(255,255,255,.075)!important;border-color:rgba(37,211,102,.44)!important;box-shadow:inset 0 0 24px rgba(37,211,102,.06),0 0 18px rgba(37,211,102,.12)!important}
      .action-row a[href*="wa.me"] i,.contact-options a[href*="wa.me"] i{color:#25d366!important;text-shadow:0 0 16px rgba(37,211,102,.72)}
      .content-like{position:absolute!important;z-index:3!important;right:8px!important;top:8px!important;left:auto!important;bottom:auto!important;min-width:46px;min-height:30px;border:1px solid rgba(255,255,255,.18)!important;border-radius:999px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:5px!important;padding:0 8px!important;color:#fff!important;background:rgba(5,5,10,.68)!important;backdrop-filter:blur(12px);font-size:.72rem!important;font-weight:900!important;box-shadow:0 0 18px rgba(168,85,247,.28)!important;cursor:pointer;transition:transform 160ms ease,background 160ms ease,box-shadow 160ms ease}
      .content-like:hover,.content-like:active,.content-like.is-liked{transform:translateY(-1px) scale(1.03);background:rgba(168,85,247,.24)!important;box-shadow:0 0 24px rgba(168,85,247,.5)!important}
      .content-like.is-liked i,.modal-like.is-liked i,.story-like.is-liked i{color:#ff4d8d}
      .modal-like-row,.story-like-row{margin-top:14px;display:flex;justify-content:flex-start}.story-card .story-like-row{margin:0;padding:0 18px 18px;background:rgba(5,5,10,.96)}
      .modal-like,.story-like{min-height:42px;border:1px solid rgba(168,85,247,.34);border-radius:999px;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:0 14px;color:#fff;background:rgba(255,255,255,.07);cursor:pointer;font-size:.84rem;font-weight:900;box-shadow:inset 0 0 18px rgba(168,85,247,.05);transition:transform 160ms ease,background 160ms ease,box-shadow 160ms ease}
      .modal-like:hover,.story-like:hover,.modal-like:active,.story-like:active,.modal-like.is-liked,.story-like.is-liked{transform:translateY(-2px);background:rgba(168,85,247,.2);box-shadow:0 0 32px rgba(168,85,247,.42)}
      .story-card h2{padding-bottom:8px!important}
      .skill-viewer-modal{position:fixed;inset:0;z-index:90;display:none;place-items:center;padding:16px;background:rgba(0,0,0,.92);backdrop-filter:blur(18px)}
      .skill-viewer-modal.is-open{display:grid;animation:skillFade .2s ease both}
      .skill-viewer{width:min(560px,100%);max-height:min(76vh,680px);border:1px solid rgba(216,180,254,.42);border-radius:26px;display:grid;grid-template-rows:auto 1fr;background:linear-gradient(145deg,rgba(13,13,20,.98),rgba(6,6,12,.96));box-shadow:0 0 90px rgba(168,85,247,.36),0 24px 80px rgba(0,0,0,.6);overflow:hidden;animation:skillPop .28s cubic-bezier(.2,.85,.2,1.1) both}
      .skill-viewer-bar{min-height:58px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;border-bottom:1px solid rgba(168,85,247,.25);background:rgba(255,255,255,.055)}
      .skill-viewer-title{display:inline-flex;align-items:center;gap:10px;min-width:0;color:#fff;font-weight:900}.skill-viewer-title i{color:#d8b4fe;text-shadow:0 0 18px rgba(168,85,247,.7)}
      .skill-viewer-title span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.skill-viewer-close{width:40px;height:40px;border:1px solid rgba(216,180,254,.34);border-radius:999px;color:#fff;background:rgba(5,5,10,.86);cursor:pointer;box-shadow:0 0 24px rgba(168,85,247,.22)}
      .skill-viewer-body{overflow:auto;padding:18px;color:#e8d5ff;font-size:.96rem;font-weight:750;line-height:1.75;white-space:pre-line}.skill-viewer-body strong{color:#fff}.skill-viewer-body p{margin:0}
      .tab-card-grid article,.chip-grid span{cursor:pointer}
      @keyframes skillFade{from{opacity:0}to{opacity:1}}@keyframes skillPop{from{opacity:0;transform:translateY(16px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}
      @media (max-width:420px){.action-row{grid-template-columns:repeat(2,minmax(0,1fr))!important}.action-row button,.action-row a{min-height:50px;font-size:.82rem}.action-row a[href*="wa.me"]{grid-column:span 2;justify-content:center;border-radius:18px;font-size:.9rem}.contact-options{grid-template-columns:1fr!important}.contact-options a{min-height:58px;justify-content:flex-start;padding:0 14px;text-align:left}}
    `;
    document.head.appendChild(style);
  }

  function updateSkills() {
    const html = skills.map(([icon, label, file]) => `<article role="button" tabindex="0" data-skill-file="${file}" data-skill-title="${label}" data-skill-icon="${icon}"><i class="${icon}"></i><strong>${label}</strong></article>`).join("");
    document.querySelectorAll('.tab-panel[data-panel="skills"]').forEach((panel) => {
      if (panel.dataset.skillsFixed === "1") return;
      panel.innerHTML = html;
      panel.classList.add("tab-card-grid");
      panel.dataset.skillsFixed = "1";
    });

    document.querySelectorAll("#skills .chip-grid").forEach((grid) => {
      if (grid.dataset.skillsFixed === "1") return;
      grid.innerHTML = skills.map(([, label, file]) => `<span role="button" tabindex="0" data-skill-file="${file}" data-skill-title="${label}" data-skill-icon="fa-solid fa-circle-info">${label}</span>`).join("");
      grid.dataset.skillsFixed = "1";
    });
  }

  function ensureSkillViewer() {
    if (document.querySelector("#skillViewerModal")) return;

    const modal = document.createElement("div");
    modal.className = "skill-viewer-modal";
    modal.id = "skillViewerModal";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="skill-viewer">
        <div class="skill-viewer-bar">
          <div class="skill-viewer-title"><i id="skillViewerIcon" class="fa-solid fa-code"></i><span id="skillViewerTitle">Skill</span></div>
          <button class="skill-viewer-close" id="skillViewerClose" type="button" aria-label="Close skill"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="skill-viewer-body" id="skillViewerBody">Loading...</div>
      </div>
    `;
    document.body.appendChild(modal);

    document.querySelector("#skillViewerClose").addEventListener("click", closeSkillViewer);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeSkillViewer();
    });
  }

  function getRepo() {
    if (window.PORTFOLIO_REPO) return window.PORTFOLIO_REPO;
    const host = window.location.hostname;
    if (!host.endsWith("github.io")) return "voidflare-root/profile";
    const owner = host.replace(".github.io", "");
    const repo = window.location.pathname.split("/").filter(Boolean)[0] || `${owner}.github.io`;
    return `${owner}/${repo}`;
  }

  async function fetchSkillText(file) {
    const localUrl = `skills/${file}`;
    try {
      const response = await fetch(localUrl, { cache: "no-store" });
      if (response.ok) return await response.text();
    } catch {
      // Try GitHub raw URL below.
    }

    try {
      const response = await fetch(`https://raw.githubusercontent.com/${getRepo()}/main/skills/${file}`, { cache: "no-store" });
      if (response.ok) return await response.text();
    } catch {
      // Use fallback text below.
    }

    return fallbackSkillText.get(file) || "Is skill ke bare me details skills folder ke txt file me add karo.";
  }

  async function openSkillViewer(skill) {
    ensureSkillViewer();
    const modal = document.querySelector("#skillViewerModal");
    const icon = document.querySelector("#skillViewerIcon");
    const title = document.querySelector("#skillViewerTitle");
    const body = document.querySelector("#skillViewerBody");

    icon.className = skill.icon || "fa-solid fa-code";
    title.textContent = skill.title || "Skill";
    body.textContent = "Loading...";
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    body.textContent = (await fetchSkillText(skill.file)).trim();
  }

  function closeSkillViewer() {
    const modal = document.querySelector("#skillViewerModal");
    modal?.classList.remove("is-open");
    modal?.setAttribute("aria-hidden", "true");
  }

  function bindSkillClicks() {
    if (document.body.dataset.skillClicksBound === "1") return;
    document.body.dataset.skillClicksBound = "1";

    document.addEventListener("click", (event) => {
      const skill = event.target.closest("[data-skill-file]");
      if (!skill) return;
      event.preventDefault();
      openSkillViewer({
        file: skill.dataset.skillFile,
        title: skill.dataset.skillTitle || skill.textContent.trim(),
        icon: skill.dataset.skillIcon,
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeSkillViewer();
      if (event.key !== "Enter" && event.key !== " ") return;
      const skill = event.target.closest?.("[data-skill-file]");
      if (!skill) return;
      event.preventDefault();
      openSkillViewer({
        file: skill.dataset.skillFile,
        title: skill.dataset.skillTitle || skill.textContent.trim(),
        icon: skill.dataset.skillIcon,
      });
    });
  }

  function attachLike(el, key) {
    if (!el || el.dataset.likeBound === "1") return;
    el.dataset.likeBound = "1";
    el.dataset.likeKey = key;
    setButton(el, key);
    el.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggle(key);
    });
    el.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      event.stopPropagation();
      toggle(key);
    });
  }

  function ensureContentLikes() {
    document.querySelectorAll(".post-card").forEach((card) => {
      const img = card.querySelector("img");
      const key = keyFor("post", img?.src || card.dataset.title);
      let like = card.querySelector(".content-like");
      if (!like) {
        like = document.createElement("span");
        like.className = "content-like";
        like.setAttribute("role", "button");
        like.setAttribute("tabindex", "0");
        like.innerHTML = '<i class="fa-solid fa-heart"></i><b class="like-count">0</b>';
        card.appendChild(like);
      }
      attachLike(like, key);
    });

    document.querySelectorAll(".story-item").forEach((item) => {
      const media = item.querySelector("img,video");
      const key = keyFor("story", media?.src || media?.getAttribute("src") || item.textContent.trim());
      let like = item.querySelector(".content-like");
      if (!like) {
        like = document.createElement("span");
        like.className = "content-like";
        like.setAttribute("role", "button");
        like.setAttribute("tabindex", "0");
        like.innerHTML = '<i class="fa-solid fa-heart"></i><b class="like-count">0</b>';
        item.appendChild(like);
      }
      attachLike(like, key);
    });
  }

  function ensureModalLikes() {
    const postDescription = document.querySelector("#modalDescription");
    if (postDescription && !document.querySelector("#postModalLike")) {
      const row = document.createElement("div");
      row.className = "modal-like-row";
      row.innerHTML = '<button class="modal-like" id="postModalLike" type="button"><i class="fa-solid fa-heart"></i><span>Like</span><b class="like-count">0</b></button>';
      postDescription.insertAdjacentElement("afterend", row);
    }

    const storyTitle = document.querySelector("#storyTitle");
    if (storyTitle && !document.querySelector("#storyModalLike")) {
      const row = document.createElement("div");
      row.className = "story-like-row";
      row.innerHTML = '<button class="story-like" id="storyModalLike" type="button"><i class="fa-solid fa-heart"></i><span>Like</span><b class="like-count">0</b></button>';
      storyTitle.insertAdjacentElement("afterend", row);
    }
  }

  function bindModalSync() {
    document.addEventListener("click", (event) => {
      const card = event.target.closest(".post-card");
      if (card && !event.target.closest(".content-like")) {
        window.setTimeout(() => {
          const img = card.querySelector("img");
          const key = keyFor("post", img?.src || card.dataset.title);
          attachLike(document.querySelector("#postModalLike"), key);
          refresh(key);
        }, 80);
      }

      const story = event.target.closest(".story-item,.highlight-item,#dpStoryButton,.dp-ring");
      if (story && !event.target.closest(".content-like")) {
        window.setTimeout(() => {
          const media = document.querySelector("#storyVideo:not([hidden]),#storyImage:not([hidden])");
          const key = keyFor("story", media?.src || document.querySelector("#storyTitle")?.textContent);
          attachLike(document.querySelector("#storyModalLike"), key);
          refresh(key);
        }, 120);
      }
    }, true);
  }

  function init() {
    addStyle();
    updateSkills();
    ensureSkillViewer();
    ensureModalLikes();
    ensureContentLikes();
    bindModalSync();
    bindSkillClicks();
    new MutationObserver(() => {
      updateSkills();
      ensureModalLikes();
      ensureContentLikes();
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
