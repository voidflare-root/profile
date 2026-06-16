(() => {
  const imageExt = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
  const videoExt = [".mp4", ".webm", ".mov", ".m4v"];
  const repo = () => window.PORTFOLIO_REPO || "voidflare-root/profile";
  const isImage = (name) => imageExt.some((ext) => name.toLowerCase().endsWith(ext));
  const isVideo = (name) => videoExt.some((ext) => name.toLowerCase().endsWith(ext));
  const title = (name) => name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  let stories = [];
  let index = 0;

  function cdnUrl(path) {
    return `https://cdn.jsdelivr.net/gh/${repo()}@main/${path.split("/").map(encodeURIComponent).join("/")}`;
  }

  function asStory(file, folder) {
    const name = file.name || file.path?.split("/").pop() || "";
    return { src: file.download_url || cdnUrl(file.path || `${folder}/${name}`), title: title(name), type: isVideo(name) ? "video" : "image" };
  }

  async function folderStories(folder) {
    const out = [];
    try {
      const api = await fetch(`https://api.github.com/repos/${repo()}/contents/${folder}?ref=main&t=${Date.now()}`, { cache: "no-store" });
      if (api.ok) {
        (await api.json()).filter((file) => file.type === "file" && (isImage(file.name) || isVideo(file.name))).forEach((file) => out.push(asStory(file, folder)));
      }
    } catch {}
    try {
      const manifest = await fetch(cdnUrl(`${folder}/index.json`) + `?t=${Date.now()}`, { cache: "no-store" });
      if (manifest.ok) {
        const entries = await manifest.json();
        const paths = Array.isArray(entries) ? entries : entries.files;
        if (Array.isArray(paths)) {
          paths.forEach((entry) => {
            const path = typeof entry === "string" ? entry : entry.path;
            const name = typeof entry === "string" ? path.split("/").pop() : (entry.name || path.split("/").pop());
            if (path && (isImage(name) || isVideo(name))) out.push(asStory({ name, path }, folder));
          });
        }
      }
    } catch {}
    try {
      const flat = await fetch(`https://data.jsdelivr.com/v1/package/gh/${repo()}@main/flat?t=${Date.now()}`, { cache: "no-store" });
      if (flat.ok) {
        (await flat.json()).files.filter((file) => file.name.startsWith(`/${folder}/`)).forEach((file) => {
          const path = file.name.slice(1);
          const name = path.split("/").pop();
          if (isImage(name) || isVideo(name)) out.push(asStory({ name, path }, folder));
        });
      }
    } catch {}
    const seen = new Set();
    return out.filter((item) => {
      const key = `${item.title}|${item.src}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function ensureVideo() {
    let video = document.querySelector("#storyVideo");
    const image = document.querySelector("#storyImage");
    if (!video && image) {
      video = document.createElement("video");
      video.id = "storyVideo";
      video.playsInline = true;
      video.controls = true;
      video.hidden = true;
      image.insertAdjacentElement("afterend", video);
    }
    return video;
  }

  function openAt(nextIndex) {
    if (!stories.length) return;
    index = (nextIndex + stories.length) % stories.length;
    const item = stories[index];
    const modal = document.querySelector("#storyModal");
    const image = document.querySelector("#storyImage");
    const video = ensureVideo();
    const heading = document.querySelector("#storyTitle");
    if (!modal || !image || !video || !heading) return;
    video.pause();
    video.removeAttribute("src");
    video.hidden = true;
    image.hidden = true;
    if (item.type === "video") {
      video.src = item.src;
      video.hidden = false;
      video.load();
      video.play().catch(() => {});
    } else {
      image.src = item.src;
      image.alt = item.title;
      image.hidden = false;
    }
    heading.textContent = `${item.title} ${stories.length > 1 ? `${index + 1}/${stories.length}` : ""}`.trim();
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  }

  async function loadStories() {
    stories = [...(await folderStories("stories")), ...(await folderStories("stores"))];
  }

  async function loadBio() {
    const bio = document.querySelector(".bio span");
    if (!bio) return;
    try {
      let text = "";
      const api = await fetch(`https://api.github.com/repos/${repo()}/contents/bio/bio.txt?ref=main&t=${Date.now()}`, { cache: "no-store" });
      if (api.ok) {
        const data = await api.json();
        text = decodeURIComponent(escape(atob(String(data.content || "").replace(/\s/g, ""))));
      }
      if (!text) {
        const raw = await fetch(`https://raw.githubusercontent.com/${repo()}/main/bio/bio.txt?t=${Date.now()}`, { cache: "no-store" });
        if (raw.ok) text = await raw.text();
      }
      if (!text) {
        const cdn = await fetch(cdnUrl("bio/bio.txt") + `?t=${Date.now()}`, { cache: "no-store" });
        if (cdn.ok) text = await cdn.text();
      }
      text = text.replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ").trim();
      if (text) bio.textContent = text;
    } catch {}
  }

  function bind() {
    if (document.body.dataset.freshGithubSyncBound === "1") return;
    document.body.dataset.freshGithubSyncBound = "1";
    window.addEventListener("click", async (event) => {
      const dp = event.target.closest("#dpStoryButton,.dp-ring");
      if (!dp) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!stories.length) await loadStories();
      openAt(0);
    }, true);
    document.querySelector("#storyVideo")?.addEventListener("ended", () => openAt(index + 1));
    document.addEventListener("keydown", (event) => {
      const modal = document.querySelector("#storyModal");
      if (!modal?.classList.contains("is-open")) return;
      if (event.key === "ArrowRight") openAt(index + 1);
      if (event.key === "ArrowLeft") openAt(index - 1);
    });
    document.querySelector("#storyModal")?.addEventListener("click", (event) => {
      if (!event.target.closest("#storyImage,#storyVideo")) return;
      if ((event.clientX || 0) < window.innerWidth * 0.38) openAt(index - 1);
      else openAt(index + 1);
    });
  }

  async function init() {
    bind();
    await Promise.all([loadStories(), loadBio()]);
    window.setTimeout(loadBio, 1200);
  }

  if (document.readyState === "loading") window.addEventListener("DOMContentLoaded", init);
  else init();
})();
