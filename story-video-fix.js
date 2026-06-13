(() => {
  const imageExtensions = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
  const videoExtensions = [".mp4", ".webm", ".mov", ".m4v"];

  const isImage = (name) => imageExtensions.some((ext) => name.toLowerCase().endsWith(ext));
  const isVideo = (name) => videoExtensions.some((ext) => name.toLowerCase().endsWith(ext));
  const titleFromFilename = (name) =>
    name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

  function getGithubRepoFromUrl() {
    const host = window.location.hostname;
    const pathParts = window.location.pathname.split("/").filter(Boolean);

    if (!host.endsWith("github.io")) {
      return "";
    }

    const owner = host.replace(".github.io", "");
    const repo = pathParts[0] || `${owner}.github.io`;
    return `${owner}/${repo}`;
  }

  async function getStoryMedia() {
    const repo = window.PORTFOLIO_REPO || getGithubRepoFromUrl();

    if (!repo) {
      return [];
    }

    const response = await fetch(`https://api.github.com/repos/${repo}/contents/stories`, { cache: "no-store" });

    if (!response.ok) {
      return [];
    }

    const files = await response.json();
    return files
      .filter((file) => file.type === "file" && (isImage(file.name) || isVideo(file.name)))
      .map((file) => ({
        src: file.download_url,
        title: titleFromFilename(file.name),
        type: isVideo(file.name) ? "video" : "image",
      }));
  }

  function ensureVideoElement() {
    const storyImage = document.querySelector("#storyImage");
    let storyVideo = document.querySelector("#storyVideo");

    if (!storyImage || storyVideo) {
      return storyVideo;
    }

    storyVideo = document.createElement("video");
    storyVideo.id = "storyVideo";
    storyVideo.playsInline = true;
    storyVideo.controls = true;
    storyVideo.hidden = true;
    storyImage.insertAdjacentElement("afterend", storyVideo);
    return storyVideo;
  }

  function preview(item) {
    if (item.type === "video") {
      return `<video src="${item.src}" muted playsinline preload="metadata"></video><i class="fa-solid fa-play story-play-icon" aria-hidden="true"></i>`;
    }

    return `<img src="${item.src}" alt="${item.title}" />`;
  }

  function openStory(item) {
    const modal = document.querySelector("#storyModal");
    const storyImage = document.querySelector("#storyImage");
    const storyVideo = ensureVideoElement();
    const storyTitle = document.querySelector("#storyTitle");

    if (!modal || !storyImage || !storyVideo || !storyTitle) {
      return;
    }

    storyVideo.pause();
    storyVideo.removeAttribute("src");
    storyVideo.hidden = true;
    storyImage.hidden = true;

    if (item.type === "video") {
      storyVideo.src = item.src;
      storyVideo.hidden = false;
      storyVideo.load();
      storyVideo.play().catch(() => {});
    } else {
      storyImage.src = item.src;
      storyImage.alt = item.title;
      storyImage.hidden = false;
    }

    storyTitle.textContent = item.title;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeStory() {
    document.querySelector("#storyVideo")?.pause();
  }

  function renderStories(stories) {
    const grid = document.querySelector("#storyGrid");

    if (!grid || !stories.length) {
      return;
    }

    grid.innerHTML = "";
    stories.forEach((item) => {
      const button = document.createElement("button");
      button.className = "story-item";
      button.type = "button";
      button.innerHTML = preview(item);
      button.addEventListener("click", () => openStory(item));
      grid.appendChild(button);
    });

    const dp = document.querySelector("#dpStoryButton, .dp-ring");
    dp?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      openStory(stories[0]);
    }, true);
  }

  const style = document.createElement("style");
  style.textContent = `
    .story-item{position:relative}.story-item video{width:100%;aspect-ratio:9/16;display:block;object-fit:cover}
    .story-play-icon{position:absolute;inset:50% auto auto 50%;z-index:2;width:34px;height:34px;border-radius:999px;display:grid;place-items:center;color:#fff;background:rgba(5,5,10,.62);box-shadow:0 0 18px rgba(168,85,247,.6);transform:translate(-50%,-50%)}
    .story-card video{width:100%;height:100%;min-height:0;display:block;object-fit:cover;background:#05050a}
  `;
  document.head.appendChild(style);

  async function initStoryVideoFix() {
    ensureVideoElement();
    const stories = await getStoryMedia();
    renderStories(stories);
    document.querySelector("#storyClose")?.addEventListener("click", closeStory);
    document.querySelector("#storyModal")?.addEventListener("click", (event) => {
      if (event.target.id === "storyModal") {
        closeStory();
      }
    });
  }

  if (document.readyState === "loading") {
    window.addEventListener("load", initStoryVideoFix);
  } else {
    initStoryVideoFix();
  }
})();
