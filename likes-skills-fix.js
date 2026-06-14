(() => {
  const skills = [
    ["fa-brands fa-android", "Android Development"],
    ["fa-solid fa-code", "Kotlin"],
    ["fa-brands fa-python", "Python"],
    ["fa-solid fa-globe", "Web Development"],
    ["fa-brands fa-java", "Java"],
    ["fa-brands fa-html5", "HTML"],
    ["fa-brands fa-css3-alt", "CSS"],
    ["fa-solid fa-laptop-code", "Coding"],
    ["fa-solid fa-user-secret", "Hacking"],
    ["fa-solid fa-robot", "AI Tools"],
    ["fa-brands fa-telegram", "Telegram Bots"],
  ];

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
      @media (max-width:420px){.action-row{grid-template-columns:repeat(2,minmax(0,1fr))!important}.action-row button,.action-row a{min-height:50px;font-size:.82rem}.action-row a[href*="wa.me"]{grid-column:span 2;justify-content:center;border-radius:18px;font-size:.9rem}.contact-options{grid-template-columns:1fr!important}.contact-options a{min-height:58px;justify-content:flex-start;padding:0 14px;text-align:left}}
    `;
    document.head.appendChild(style);
  }

  function updateSkills() {
    const html = skills.map(([icon, label]) => `<article><i class="${icon}"></i><strong>${label}</strong></article>`).join("");
    document.querySelectorAll('.tab-panel[data-panel="skills"]').forEach((panel) => {
      if (panel.dataset.skillsFixed === "1") return;
      panel.innerHTML = html;
      panel.classList.add("tab-card-grid");
      panel.dataset.skillsFixed = "1";
    });

    document.querySelectorAll("#skills .chip-grid").forEach((grid) => {
      if (grid.dataset.skillsFixed === "1") return;
      grid.innerHTML = skills.map(([, label]) => `<span>${label}</span>`).join("");
      grid.dataset.skillsFixed = "1";
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
    ensureModalLikes();
    ensureContentLikes();
    bindModalSync();
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
