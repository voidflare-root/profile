const likeButton = document.querySelector("#likeButton");
const shareButton = document.querySelector("#shareButton");
const qrButton = document.querySelector("#qrButton");
const contactForm = document.querySelector("#contactForm");
const toast = document.querySelector("#toast");
const postModal = document.querySelector("#postModal");
const modalClose = document.querySelector("#modalClose");
const modalImage = document.querySelector("#modalImage");
const modalTag = document.querySelector("#modalTag");
const modalTitle = document.querySelector("#modalTitle");
const modalDescription = document.querySelector("#modalDescription");
const profileDp = document.querySelector("#profileDp");
const postGrid = document.querySelector("#postGrid");
const qrModal = document.querySelector("#qrModal");
const qrClose = document.querySelector("#qrClose");
const qrImage = document.querySelector("#qrImage");
const qrLink = document.querySelector("#qrLink");

const fallbackDp =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=500&q=90";
const imageExtensions = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
const fallbackPosts = Array.from(document.querySelectorAll(".post-card")).map((card) => ({
  src: card.querySelector("img").src,
  title: card.dataset.title,
  tag: card.dataset.tag,
  description: card.dataset.description,
}));

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function isImageFile(name) {
  return imageExtensions.some((extension) => name.toLowerCase().endsWith(extension));
}

function titleFromFilename(name) {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

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

async function getPostImagesFromGithub() {
  const repo = window.PORTFOLIO_REPO || getGithubRepoFromUrl();

  if (!repo) {
    return [];
  }

  const response = await fetch(`https://api.github.com/repos/${repo}/contents/posts`);

  if (!response.ok) {
    return [];
  }

  const files = await response.json();
  return files
    .filter((file) => file.type === "file" && isImageFile(file.name))
    .map((file) => ({
      src: file.download_url,
      title: titleFromFilename(file.name),
      tag: "Post",
      description: `${file.name} from posts folder.`,
    }));
}

async function getPostImagesFromManifest() {
  try {
    const response = await fetch("posts/posts.json", { cache: "no-store" });

    if (!response.ok) {
      return [];
    }

    const posts = await response.json();
    return posts
      .filter((post) => post.src)
      .map((post) => ({
        src: post.src,
        title: post.title || titleFromFilename(post.src.split("/").pop()),
        tag: post.tag || "Post",
        description: post.description || "Portfolio post.",
      }));
  } catch {
    return [];
  }
}

function renderPosts(posts) {
  postGrid.innerHTML = "";

  posts.forEach((post, index) => {
    const card = document.createElement("button");
    card.className = "post-card";
    card.type = "button";
    card.dataset.title = post.title;
    card.dataset.tag = post.tag;
    card.dataset.description = post.description;
    card.innerHTML = `
      <img src="${post.src}" alt="${post.title}" />
      <span>${post.tag}</span>
    `;
    card.querySelector("img").addEventListener("error", () => {
      const fallback = fallbackPosts[index % fallbackPosts.length];
      card.querySelector("img").src = fallback.src;
    });
    postGrid.appendChild(card);
  });

  attachPostEvents();
}

async function loadPosts() {
  const githubPosts = await getPostImagesFromGithub();
  const manifestPosts = githubPosts.length ? [] : await getPostImagesFromManifest();
  const posts = githubPosts.length ? githubPosts : manifestPosts.length ? manifestPosts : fallbackPosts;
  renderPosts(posts);
}

likeButton.addEventListener("click", () => {
  likeButton.classList.toggle("is-liked");
  showToast(likeButton.classList.contains("is-liked") ? "Liked profile." : "Like removed.");
});

shareButton.addEventListener("click", async () => {
  const data = {
    title: "PIYUSH Developer Profile",
    text: "Check out PIYUSH portfolio profile.",
    url: window.location.href,
  };

  if (navigator.share) {
    try {
      await navigator.share(data);
      return;
    } catch {
      return;
    }
  }

  await navigator.clipboard.writeText(window.location.href);
  showToast("Profile link copied.");
});

qrButton.addEventListener("click", () => {
  const profileLink = window.location.href.split("#")[0];
  qrLink.textContent = profileLink;
  qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(profileLink)}`;
  qrModal.classList.add("is-open");
  qrModal.setAttribute("aria-hidden", "false");
});

function attachPostEvents() {
  document.querySelectorAll(".post-card").forEach((card) => {
    card.addEventListener("click", () => {
      const image = card.querySelector("img");
      modalImage.src = image.src;
      modalImage.alt = image.alt;
      modalTag.textContent = card.dataset.tag;
      modalTitle.textContent = card.dataset.title;
      modalDescription.textContent = card.dataset.description;
      postModal.classList.add("is-open");
      postModal.setAttribute("aria-hidden", "false");
    });
  });
}

function closeModal() {
  postModal.classList.remove("is-open");
  postModal.setAttribute("aria-hidden", "true");
}

function closeQrModal() {
  qrModal.classList.remove("is-open");
  qrModal.setAttribute("aria-hidden", "true");
}

modalClose.addEventListener("click", closeModal);
qrClose.addEventListener("click", closeQrModal);
postModal.addEventListener("click", (event) => {
  if (event.target === postModal) {
    closeModal();
  }
});
qrModal.addEventListener("click", (event) => {
  if (event.target === qrModal) {
    closeQrModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
    closeQrModal();
  }
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  contactForm.reset();
  showToast("Message ready. Connect backend/email to receive it.");
});

profileDp.addEventListener("error", () => {
  profileDp.onerror = null;
  profileDp.src = fallbackDp;
});

window.addEventListener("load", () => {
  if (!profileDp.complete || profileDp.naturalWidth === 0) {
    profileDp.src = fallbackDp;
  }
});

loadPosts();
