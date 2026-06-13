const likeButton = document.querySelector('#likeButton');
const shareButton = document.querySelector('#shareButton');
const qrButton = document.querySelector('#qrButton');
const contactForm = document.querySelector('#contactForm');
const toast = document.querySelector('#toast');
const postModal = document.querySelector('#postModal');
const modalClose = document.querySelector('#modalClose');
const modalImage = document.querySelector('#modalImage');
const modalTag = document.querySelector('#modalTag');
const modalTitle = document.querySelector('#modalTitle');
const modalDescription = document.querySelector('#modalDescription');
const profileDp = document.querySelector('#profileDp');
const postGrid = document.querySelector('#postGrid');
const qrModal = document.querySelector('#qrModal');
const qrClose = document.querySelector('#qrClose');
const qrImage = document.querySelector('#qrImage');
const qrLink = document.querySelector('#qrLink');

const fallbackDp = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=500&q=90';
const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
const fallbackPosts = Array.from(document.querySelectorAll('.post-card')).map((card) => ({ src: card.querySelector('img').src, title: card.dataset.title, tag: card.dataset.tag, description: card.dataset.description }));
const fallbackHighlights = fallbackPosts.slice(0, 3).map((post, index) => ({ ...post, title: ['Work', 'Gaming', 'AI'][index] }));
const fallbackStories = fallbackPosts.slice(3, 6).map((post, index) => ({ ...post, title: ['Bot Story', 'Creator Story', 'Tools Story'][index] }));

function applyHostedFixes() {
  const style = document.createElement('style');
  style.textContent = `
    h1{max-width:100%;font-size:clamp(2rem,8.5vw,4.4rem);overflow-wrap:anywhere}.name-stack{min-width:0}@media (min-width:1024px){h1{font-size:clamp(2rem,4.2vw,3.6rem)}}
    .devotion-tags{margin-top:12px;display:grid;grid-template-columns:1fr;gap:8px}.devotion-tags span{min-height:38px;border:1px solid rgba(168,85,247,.34);border-radius:14px;display:inline-flex;align-items:center;justify-content:center;padding:8px 10px;color:#fff;background:linear-gradient(135deg,rgba(138,43,226,.18),rgba(168,85,247,.08)),rgba(255,255,255,.055);font-size:.82rem;font-weight:900;text-align:center;text-shadow:0 0 18px rgba(168,85,247,.72);box-shadow:inset 0 0 20px rgba(168,85,247,.05)}
    .social-link-block{margin-top:14px}.social-link-block h2,.highlight-block h2{margin:0 0 10px;color:#a855f7;font-size:.9rem;font-weight:900;text-transform:uppercase;text-shadow:0 0 18px rgba(168,85,247,.72)}.social-name-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.social-name-row a{min-height:44px;border:1px solid rgba(168,85,247,.32);border-radius:15px;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:8px;color:#fff;background:radial-gradient(circle at 30% 110%,rgba(255,221,85,.22) 0 18%,transparent 32%),linear-gradient(135deg,rgba(131,58,180,.26),rgba(253,29,29,.12),rgba(252,176,69,.14));font-size:.8rem;font-weight:900;box-shadow:inset 0 0 20px rgba(168,85,247,.05);transition:transform 160ms ease,box-shadow 160ms ease}.social-name-row a:hover,.social-name-row a:active{transform:translateY(-2px);box-shadow:0 0 32px rgba(168,85,247,.42)}.qr-card .modal-close{top:10px;right:10px;margin:0;border-color:rgba(168,85,247,.34);background:rgba(5,5,10,.88);box-shadow:0 0 22px rgba(168,85,247,.34)}
    .song-button{margin-top:12px;min-height:42px;border:1px solid rgba(168,85,247,.38);border-radius:15px;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:0 14px;color:#fff;background:linear-gradient(135deg,rgba(138,43,226,.22),rgba(168,85,247,.1)),rgba(255,255,255,.065);cursor:pointer;font-size:.86rem;font-weight:900;box-shadow:inset 0 0 20px rgba(168,85,247,.06);transition:transform 160ms ease,box-shadow 160ms ease,background 160ms ease}.song-button:hover,.song-button:active,.song-button.is-playing{transform:translateY(-2px);background:rgba(168,85,247,.2);box-shadow:0 0 32px rgba(168,85,247,.42)}
    .highlight-block{margin-top:14px}.highlight-row{display:flex;gap:10px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none}.highlight-row::-webkit-scrollbar{display:none}.highlight-item{width:74px;flex:0 0 74px;border:0;display:grid;justify-items:center;gap:7px;color:#fff;background:transparent;cursor:pointer;font-size:.72rem;font-weight:900}.highlight-item img{width:62px;height:62px;border:3px solid transparent;border-radius:999px;object-fit:cover;background:linear-gradient(#05050a,#05050a) padding-box,conic-gradient(from 180deg,#8a2be2,#a855f7,#fff,#8a2be2) border-box;box-shadow:0 0 22px rgba(168,85,247,.38)}.stories-section{margin-top:16px;border:1px solid rgba(168,85,247,.28);border-radius:28px;overflow:hidden;background:rgba(255,255,255,.06);backdrop-filter:blur(20px);box-shadow:0 18px 60px rgba(0,0,0,.32),inset 0 1px 0 rgba(255,255,255,.08)}.story-grid{padding:10px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.story-item{min-width:0;border:0;border-radius:18px;overflow:hidden;padding:0;cursor:pointer;background:#0d0d0d}.story-item img{width:100%;aspect-ratio:9/16;display:block;object-fit:cover}.story-modal{position:fixed;inset:0;z-index:50;padding:18px;display:none;place-items:center;background:rgba(0,0,0,.72);backdrop-filter:blur(12px)}.story-modal.is-open{display:grid}.story-card{position:relative;width:min(380px,100%);border:1px solid rgba(168,85,247,.28);border-radius:26px;overflow:hidden;background:#0d0d0d;box-shadow:0 0 60px rgba(168,85,247,.42)}.story-card img{width:100%;max-height:78vh;display:block;object-fit:contain;background:#05050a}.story-card h2{margin:0;padding:14px 18px;font-size:1rem}
  `;
  document.head.appendChild(style);

  if (!document.querySelector('.devotion-tags')) {
    const bio = document.querySelector('.bio');
    const tags = document.createElement('div');
    tags.className = 'devotion-tags';
    tags.innerHTML = '<span>HAR HAR MAHADEV</span><span>JAY SHREE RAM</span><span>RADHE RADHE</span>';
    bio?.insertAdjacentElement('afterend', tags);
  }
  if (!document.querySelector('.social-link-block')) {
    const roles = document.querySelector('.role-boxes');
    const block = document.createElement('div');
    block.className = 'social-link-block';
    block.innerHTML = `<h2>Social Links</h2><div class="social-name-row"><a href="https://www.instagram.com/i.ampys.ghost?igsh=MTZjMXNnNjJwaG43cg==&utm_source=ig_contact_invite" target="_blank" rel="noreferrer"><i class="fa-brands fa-instagram"></i><span>Piyush</span></a><a href="https://www.instagram.com/itz._.rounak_2.0?igsh=MXNnZ2M4anpyMmJxZQ==" target="_blank" rel="noreferrer"><i class="fa-brands fa-instagram"></i><span>Rounak</span></a><a href="https://www.instagram.com/shreekant6564?igsh=MWw2aHZheGJ5cGJudA==" target="_blank" rel="noreferrer"><i class="fa-brands fa-instagram"></i><span>Shreekant</span></a></div>`;
    roles?.insertAdjacentElement('afterend', block);
  }
  if (!document.querySelector('.highlight-block')) {
    const social = document.querySelector('.social-link-block') || document.querySelector('.role-boxes');
    const block = document.createElement('div');
    block.className = 'highlight-block';
    block.innerHTML = '<h2>Highlights</h2><div class="highlight-row" id="highlightRow"></div>';
    social?.insertAdjacentElement('afterend', block);
  }
  if (!document.querySelector('#stories')) {
    const posts = document.querySelector('#posts');
    const section = document.createElement('section');
    section.className = 'stories-section';
    section.id = 'stories';
    section.innerHTML = '<div class="section-title"><h2>Stories</h2><span>Latest moments</span></div><div class="story-grid" id="storyGrid"></div>';
    posts?.insertAdjacentElement('afterend', section);
  }
  if (!document.querySelector('#storyModal')) {
    const modal = document.createElement('div');
    modal.className = 'story-modal';
    modal.id = 'storyModal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = '<div class="story-card"><button class="modal-close" id="storyClose" aria-label="Close story"><i class="fa-solid fa-xmark"></i></button><img id="storyImage" alt="" /><h2 id="storyTitle"></h2></div>';
    document.body.appendChild(modal);
  }
  if (!document.querySelector('#songButton')) {
    const nameStack = document.querySelector('.name-stack');
    const button = document.createElement('button');
    button.className = 'song-button';
    button.id = 'songButton';
    button.type = 'button';
    button.innerHTML = '<i class="fa-solid fa-music"></i><span>Favorite Song</span>';
    const audio = document.createElement('audio');
    audio.id = 'favoriteSong';
    audio.src = 'song.mp3';
    audio.preload = 'metadata';
    nameStack?.append(button, audio);
    setupSongButton(button, audio);
  }
}

function showToast(message) { toast.textContent = message; toast.classList.add('show'); window.clearTimeout(showToast.timer); showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2200); }
function setupSongButton(button, audio) { button.addEventListener('click', async () => { if (audio.paused) { try { await audio.play(); button.classList.add('is-playing'); button.querySelector('span').textContent = 'Playing Song'; } catch { showToast('song.mp3 upload karo, phir song play hoga.'); } return; } audio.pause(); button.classList.remove('is-playing'); button.querySelector('span').textContent = 'Favorite Song'; }); audio.addEventListener('ended', () => { button.classList.remove('is-playing'); button.querySelector('span').textContent = 'Favorite Song'; }); }
function isImageFile(name) { return imageExtensions.some((extension) => name.toLowerCase().endsWith(extension)); }
function titleFromFilename(name) { return name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function getGithubRepoFromUrl() { const host = window.location.hostname; const pathParts = window.location.pathname.split('/').filter(Boolean); if (!host.endsWith('github.io')) return ''; const owner = host.replace('.github.io', ''); const repo = pathParts[0] || `${owner}.github.io`; return `${owner}/${repo}`; }
async function getImagesFromGithubFolder(folder) { const repo = window.PORTFOLIO_REPO || getGithubRepoFromUrl(); if (!repo) return []; const response = await fetch(`https://api.github.com/repos/${repo}/contents/${folder}`); if (!response.ok) return []; const files = await response.json(); return files.filter((file) => file.type === 'file' && isImageFile(file.name)).map((file) => ({ src: file.download_url, title: titleFromFilename(file.name), tag: folder, description: `${file.name} from ${folder} folder.` })); }
async function getPostImagesFromGithub() { return getImagesFromGithubFolder('posts'); }
async function getPostImagesFromManifest() { try { const response = await fetch('posts/posts.json', { cache: 'no-store' }); if (!response.ok) return []; const posts = await response.json(); return posts.filter((post) => post.src).map((post) => ({ src: post.src, title: post.title || titleFromFilename(post.src.split('/').pop()), tag: post.tag || 'Post', description: post.description || 'Portfolio post.' })); } catch { return []; } }
function renderPosts(posts) { postGrid.innerHTML = ''; posts.forEach((post, index) => { const card = document.createElement('button'); card.className = 'post-card'; card.type = 'button'; card.dataset.title = post.title; card.dataset.tag = post.tag; card.dataset.description = post.description; card.innerHTML = `<img src="${post.src}" alt="${post.title}" /><span>${post.tag}</span>`; card.querySelector('img').addEventListener('error', () => { const fallback = fallbackPosts[index % fallbackPosts.length]; card.querySelector('img').src = fallback.src; }); postGrid.appendChild(card); }); attachPostEvents(); }
async function loadPosts() { const githubPosts = await getPostImagesFromGithub(); const manifestPosts = githubPosts.length ? [] : await getPostImagesFromManifest(); renderPosts(githubPosts.length ? githubPosts : manifestPosts.length ? manifestPosts : fallbackPosts); }
function renderHighlights(items) { const row = document.querySelector('#highlightRow'); if (!row) return; row.innerHTML = ''; items.forEach((item) => { const button = document.createElement('button'); button.className = 'highlight-item'; button.type = 'button'; button.innerHTML = `<img src="${item.src}" alt="${item.title}" /><span>${item.title}</span>`; button.addEventListener('click', () => openStory(item)); row.appendChild(button); }); }
function renderStories(items) { const grid = document.querySelector('#storyGrid'); if (!grid) return; grid.innerHTML = ''; items.forEach((item) => { const button = document.createElement('button'); button.className = 'story-item'; button.type = 'button'; button.innerHTML = `<img src="${item.src}" alt="${item.title}" />`; button.addEventListener('click', () => openStory(item)); grid.appendChild(button); }); }
function openStory(item) { const modal = document.querySelector('#storyModal'); document.querySelector('#storyImage').src = item.src; document.querySelector('#storyImage').alt = item.title; document.querySelector('#storyTitle').textContent = item.title; modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false'); }
async function loadHighlightsAndStories() { const highlights = await getImagesFromGithubFolder('highlights'); const stories = await getImagesFromGithubFolder('stories'); renderHighlights(highlights.length ? highlights : fallbackHighlights); renderStories(stories.length ? stories : fallbackStories); }

likeButton.addEventListener('click', () => { likeButton.classList.toggle('is-liked'); showToast(likeButton.classList.contains('is-liked') ? 'Liked profile.' : 'Like removed.'); });
shareButton.addEventListener('click', async () => { const data = { title: 'PIYUSH Developer Profile', text: 'Check out PIYUSH portfolio profile.', url: window.location.href }; if (navigator.share) { try { await navigator.share(data); return; } catch { return; } } await navigator.clipboard.writeText(window.location.href); showToast('Profile link copied.'); });
qrButton.addEventListener('click', () => { const profileLink = window.location.href.split('#')[0]; qrLink.textContent = profileLink; qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(profileLink)}`; qrModal.classList.add('is-open'); qrModal.setAttribute('aria-hidden', 'false'); });
function attachPostEvents() { document.querySelectorAll('.post-card').forEach((card) => { card.addEventListener('click', () => { const image = card.querySelector('img'); modalImage.src = image.src; modalImage.alt = image.alt; modalTag.textContent = card.dataset.tag; modalTitle.textContent = card.dataset.title; modalDescription.textContent = card.dataset.description; postModal.classList.add('is-open'); postModal.setAttribute('aria-hidden', 'false'); }); }); }
function closeModal() { postModal.classList.remove('is-open'); postModal.setAttribute('aria-hidden', 'true'); }
function closeQrModal() { qrModal.classList.remove('is-open'); qrModal.setAttribute('aria-hidden', 'true'); }
modalClose.addEventListener('click', closeModal); qrClose.addEventListener('click', closeQrModal); postModal.addEventListener('click', (event) => { if (event.target === postModal) closeModal(); }); qrModal.addEventListener('click', (event) => { if (event.target === qrModal) closeQrModal(); }); document.addEventListener('click', (event) => { if (event.target.id === 'storyModal') { event.target.classList.remove('is-open'); event.target.setAttribute('aria-hidden', 'true'); } if (event.target.closest('#storyClose')) { document.querySelector('#storyModal')?.classList.remove('is-open'); document.querySelector('#storyModal')?.setAttribute('aria-hidden', 'true'); } }); document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { closeModal(); closeQrModal(); document.querySelector('#storyModal')?.classList.remove('is-open'); document.querySelector('#storyModal')?.setAttribute('aria-hidden', 'true'); } });
contactForm.addEventListener('submit', (event) => { event.preventDefault(); contactForm.reset(); showToast('Message ready. Connect backend/email to receive it.'); });
profileDp.addEventListener('error', () => { profileDp.onerror = null; profileDp.src = fallbackDp; }); window.addEventListener('load', () => { if (!profileDp.complete || profileDp.naturalWidth === 0) profileDp.src = fallbackDp; });

const existingSongButton = document.querySelector('#songButton'); const existingFavoriteSong = document.querySelector('#favoriteSong'); if (existingSongButton && existingFavoriteSong) setupSongButton(existingSongButton, existingFavoriteSong);
applyHostedFixes();
loadPosts();
loadHighlightsAndStories();
