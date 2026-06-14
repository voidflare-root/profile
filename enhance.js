function addTabAndStoryEnhancements() {
  const style = document.createElement('style');
  style.textContent = `
    .dp-ring{border:0;cursor:pointer;transition:transform 160ms ease,box-shadow 160ms ease}.dp-ring:hover,.dp-ring:active{transform:scale(1.03);box-shadow:0 0 46px rgba(168,85,247,.78)}
    .section-title{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));align-items:center}.posts-toggle,.others-toggle,.notes-toggle{min-height:38px;border:1px solid rgba(168,85,247,.32);border-radius:999px;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:0 13px;color:#fff;background:rgba(255,255,255,.065);cursor:pointer;font-size:.82rem;font-weight:900;box-shadow:inset 0 0 20px rgba(168,85,247,.05)}.posts-toggle:hover,.posts-toggle:active,.posts-toggle.is-open,.others-toggle:hover,.others-toggle:active,.others-toggle.is-open,.notes-toggle:hover,.notes-toggle:active,.notes-toggle.is-open{background:rgba(168,85,247,.2);box-shadow:0 0 32px rgba(168,85,247,.42)}
    .profile-tabs{display:none!important}.tab-panel[hidden]{display:none!important}
    .tab-card-grid{padding:10px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.tab-card-grid article,.tab-list a{min-height:104px;border:1px solid rgba(168,85,247,.24);border-radius:18px;display:grid;align-content:center;justify-items:center;gap:10px;padding:12px;color:#fff;background:linear-gradient(135deg,rgba(138,43,226,.13),rgba(168,85,247,.05)),rgba(255,255,255,.055);text-align:center;font-size:.82rem;box-shadow:inset 0 0 20px rgba(168,85,247,.04)}.tab-card-grid i,.tab-list i{color:#a855f7;font-size:1.35rem;text-shadow:0 0 16px rgba(168,85,247,.72)}.tab-list{padding:10px;display:grid;gap:8px}.tab-list a{min-height:58px;grid-template-columns:minmax(0,1fr) auto;align-content:center;justify-items:stretch;text-align:left}
    body.is-others-mode .tab-panel[data-panel="skills"],body.is-others-mode .tab-panel[data-panel="projects"],body.is-others-mode .tab-panel[data-panel="services"],body.is-others-mode .tab-panel[data-panel="notes"]{margin:10px;border:1px solid rgba(168,85,247,.18);border-radius:22px;background:rgba(255,255,255,.035)}body.is-others-mode .tab-panel[data-panel="projects"],body.is-others-mode .tab-panel[data-panel="services"],body.is-others-mode .tab-panel[data-panel="notes"]{margin-top:0}
    .notes-panel{padding:12px}.notes-head{min-height:46px;display:inline-flex;align-items:center;gap:10px;color:#a855f7;font-weight:900;text-shadow:0 0 16px rgba(168,85,247,.72)}.notes-list{display:grid;gap:10px}.notes-list p{margin:0;color:#b8b8b8;line-height:1.6}.note-item{min-height:74px;border:1px solid rgba(168,85,247,.24);border-radius:18px;display:grid;gap:10px;padding:12px;background:linear-gradient(135deg,rgba(138,43,226,.13),rgba(168,85,247,.05)),rgba(255,255,255,.055)}.note-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.note-actions a,.note-actions button{min-height:38px;border:1px solid rgba(168,85,247,.28);border-radius:14px;display:inline-flex;align-items:center;justify-content:center;gap:8px;color:#fff;background:rgba(255,255,255,.06);cursor:pointer;font-size:.82rem;font-weight:900;text-decoration:none}
    .note-modal{position:fixed;inset:0;z-index:70;padding:0;display:none;place-items:center;background:rgba(0,0,0,.92);backdrop-filter:blur(16px)}.note-modal.is-open{display:grid}.note-viewer{width:min(920px,100%);height:100vh;border:1px solid rgba(168,85,247,.32);display:grid;grid-template-rows:auto 1fr;background:#05050a;box-shadow:0 0 80px rgba(168,85,247,.44)}.note-viewer-bar{min-height:58px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;border-bottom:1px solid rgba(168,85,247,.24);background:rgba(255,255,255,.055)}.note-viewer-bar .modal-close{position:static;margin:0;flex:0 0 auto}.note-viewer iframe{width:100%;height:100%;border:0;background:#111}
    .info-section{display:none!important}.info-section#contact{display:block!important}body.is-others-mode .stories-section,body.is-others-mode .info-section#contact{display:none!important}
    .story-modal{padding:0;background:rgba(0,0,0,.92);backdrop-filter:blur(16px)}.story-card{width:min(460px,100%);height:100vh;border:0;border-radius:0;display:grid;grid-template-rows:1fr auto;background:#05050a;box-shadow:0 0 80px rgba(168,85,247,.48)}.story-card img,.story-card video{width:100%;height:100%;min-height:0;display:block;object-fit:cover;background:#05050a}.story-card h2{margin:0;padding:16px 18px 22px;font-size:1rem;background:linear-gradient(180deg,rgba(5,5,10,.2),rgba(5,5,10,.96))}.story-card .modal-close{top:14px;right:14px;margin:0;z-index:2;background:rgba(5,5,10,.82);box-shadow:0 0 22px rgba(168,85,247,.34)}
  `;
  document.head.appendChild(style);

  if (!document.querySelector('#noteModal')) {
    const modal = document.createElement('div');
    modal.className = 'note-modal';
    modal.id = 'noteModal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `<div class="note-viewer"><div class="note-viewer-bar"><strong id="noteViewerTitle">Note</strong><button class="modal-close" id="noteClose" aria-label="Close note"><i class="fa-solid fa-xmark"></i></button></div><iframe id="noteFrame" title="Note preview"></iframe></div>`;
    document.body.appendChild(modal);
  }

  const actionRow = document.querySelector('.action-row');
  const highlight = document.querySelector('.highlight-block');
  if (actionRow && highlight && actionRow.nextElementSibling !== highlight) actionRow.insertAdjacentElement('afterend', highlight);

  const dp = document.querySelector('.dp-ring');
  dp?.setAttribute('role', 'button');
  dp?.setAttribute('tabindex', '0');
  dp?.setAttribute('aria-label', 'Open profile story');

  const postsSection = document.querySelector('#posts');
  const postGrid = document.querySelector('#postGrid');
  if (!postsSection || !postGrid) return;

  const sectionTitle = postsSection.querySelector('.section-title');
  if (sectionTitle) {
    sectionTitle.innerHTML = `
      <button class="posts-toggle is-open" id="postsToggle" type="button"><i class="fa-solid fa-table-cells"></i><span>Posts</span></button>
      <button class="others-toggle" id="othersToggle" type="button"><i class="fa-solid fa-code"></i><span>Skills</span></button>
      <button class="notes-toggle" id="notesToggle" type="button"><i class="fa-solid fa-note-sticky"></i><span>Notes</span></button>
    `;
  }
  const postsToggle = document.querySelector('#postsToggle');
  const skillsToggle = document.querySelector('#othersToggle');
  const notesToggle = document.querySelector('#notesToggle');

  document.querySelector('#profileTabs')?.remove();
  postGrid.classList.add('tab-panel', 'is-active');
  postGrid.dataset.panel = 'posts';

  if (!document.querySelector('.tab-panel[data-panel="skills"]')) {
    const panels = document.createElement('div');
    panels.innerHTML = `
      <div class="tab-panel tab-card-grid" data-panel="skills" hidden><article><i class="fa-brands fa-android"></i><strong>Android Development</strong></article><article><i class="fa-solid fa-code"></i><strong>Kotlin</strong></article><article><i class="fa-brands fa-python"></i><strong>Python</strong></article><article><i class="fa-solid fa-globe"></i><strong>Web Development</strong></article><article><i class="fa-solid fa-robot"></i><strong>AI Tools</strong></article><article><i class="fa-brands fa-telegram"></i><strong>Telegram Bots</strong></article></div>
      <div class="tab-panel tab-list" data-panel="projects" hidden><a href="#"><span>AI Dashboard</span><i class="fa-solid fa-arrow-up-right-from-square"></i></a><a href="#"><span>Android Creator App</span><i class="fa-solid fa-arrow-up-right-from-square"></i></a><a href="#"><span>Telegram Automation Bot</span><i class="fa-solid fa-arrow-up-right-from-square"></i></a></div>
      <div class="tab-panel tab-card-grid" data-panel="services" hidden><article><i class="fa-solid fa-mobile-screen-button"></i><strong>App UI</strong></article><article><i class="fa-solid fa-code"></i><strong>Websites</strong></article><article><i class="fa-solid fa-robot"></i><strong>AI Projects</strong></article></div>
      <div class="tab-panel notes-panel" data-panel="notes" hidden><div class="notes-head"><i class="fa-solid fa-note-sticky"></i><strong>Notes</strong></div><div class="notes-list" id="notesList"><p>GitHub ke <strong>notes</strong> folder me files upload karo, yahan show honge.</p></div></div>
    `;
    postGrid.after(...Array.from(panels.children));
  }

  const tabPanels = document.querySelectorAll('.tab-panel');
  const setPanel = (activePanels) => {
    tabPanels.forEach((panel) => {
      const active = activePanels.includes(panel.dataset.panel);
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
  };
  const setButtons = (active) => {
    postsToggle?.classList.toggle('is-open', active === 'posts');
    skillsToggle?.classList.toggle('is-open', active === 'skills');
    notesToggle?.classList.toggle('is-open', active === 'notes');
    document.body.classList.toggle('is-others-mode', active !== 'posts');
  };
  const showPostsMode = () => { setButtons('posts'); setPanel(['posts']); };
  const showSkillsMode = () => { setButtons('skills'); setPanel(['skills', 'projects', 'services']); };
  const showNotesMode = () => { setButtons('notes'); setPanel(['notes']); };

  postsToggle?.addEventListener('click', showPostsMode);
  skillsToggle?.addEventListener('click', showSkillsMode);
  notesToggle?.addEventListener('click', showNotesMode);

  function openNoteViewer(title, url) {
    document.querySelector('#noteViewerTitle').textContent = title;
    document.querySelector('#noteFrame').src = url;
    const modal = document.querySelector('#noteModal');
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  }
  function closeNoteViewer() {
    document.querySelector('#noteFrame')?.removeAttribute('src');
    const modal = document.querySelector('#noteModal');
    modal?.classList.remove('is-open');
    modal?.setAttribute('aria-hidden', 'true');
  }
  document.querySelector('#noteClose')?.addEventListener('click', closeNoteViewer);
  document.querySelector('#noteModal')?.addEventListener('click', (event) => { if (event.target.id === 'noteModal') closeNoteViewer(); });

  async function loadNotes() {
    const notesList = document.querySelector('#notesList');
    if (!notesList) return;

    const host = window.location.hostname;
    let owner = 'voidflare-root';
    let repo = 'profile';
    if (host.endsWith('github.io')) {
      owner = host.replace('.github.io', '');
      repo = window.location.pathname.split('/').filter(Boolean)[0] || `${owner}.github.io`;
    }

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/notes`, { cache: 'no-store' });
    if (!response.ok) return;
    const files = (await response.json()).filter((file) => file.type === 'file' && !file.name.startsWith('.'));
    if (!files.length) return;

    notesList.innerHTML = '';
    files.forEach((file) => {
      const title = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
      const item = document.createElement('article');
      item.className = 'note-item';
      const titleEl = document.createElement('strong');
      titleEl.textContent = title;
      const actions = document.createElement('div');
      actions.className = 'note-actions';
      const open = document.createElement('button');
      open.type = 'button';
      open.innerHTML = '<i class="fa-solid fa-eye"></i><span>Open</span>';
      open.addEventListener('click', () => openNoteViewer(title, file.download_url));
      const download = document.createElement('a');
      download.href = file.download_url;
      download.download = file.name;
      download.innerHTML = '<i class="fa-solid fa-download"></i><span>Download</span>';
      actions.append(open, download);
      item.append(titleEl, actions);
      notesList.appendChild(item);
    });
  }
  loadNotes();

  if (!document.querySelector('script[src^="story-video-fix.js"]')) {
    const videoFix = document.createElement('script');
    videoFix.src = 'story-video-fix.js?v=3';
    document.body.appendChild(videoFix);
  }
}

window.addEventListener('load', addTabAndStoryEnhancements);
