function addTabAndStoryEnhancements() {
  const style = document.createElement('style');
  style.textContent = `
    .dp-ring{border:0;cursor:pointer;transition:transform 160ms ease,box-shadow 160ms ease}.dp-ring:hover,.dp-ring:active{transform:scale(1.03);box-shadow:0 0 46px rgba(168,85,247,.78)}
    .others-toggle{min-height:38px;border:1px solid rgba(168,85,247,.32);border-radius:999px;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:0 13px;color:#fff;background:rgba(255,255,255,.065);cursor:pointer;font-size:.82rem;font-weight:900;box-shadow:inset 0 0 20px rgba(168,85,247,.05)}.others-toggle:hover,.others-toggle:active,.others-toggle.is-open{background:rgba(168,85,247,.2);box-shadow:0 0 32px rgba(168,85,247,.42)}
    .profile-tabs{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));border-bottom:1px solid rgba(168,85,247,.18);background:rgba(255,255,255,.035)}.profile-tabs[hidden]{display:none!important}.profile-tabs button{position:relative;min-height:54px;border:0;display:inline-flex;align-items:center;justify-content:center;gap:7px;color:#b8b8b8;background:transparent;cursor:pointer;font-size:.78rem;font-weight:900}.profile-tabs button.is-active{color:#fff}.profile-tabs button.is-active:after{content:"";position:absolute;left:18%;right:18%;bottom:0;height:3px;border-radius:999px 999px 0 0;background:linear-gradient(90deg,#8a2be2,#a855f7);box-shadow:0 0 16px rgba(168,85,247,.7)}.tab-panel[hidden]{display:none!important}
    .tab-card-grid{padding:10px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.tab-card-grid article,.tab-list a{min-height:104px;border:1px solid rgba(168,85,247,.24);border-radius:18px;display:grid;align-content:center;justify-items:center;gap:10px;padding:12px;color:#fff;background:linear-gradient(135deg,rgba(138,43,226,.13),rgba(168,85,247,.05)),rgba(255,255,255,.055);text-align:center;font-size:.82rem;box-shadow:inset 0 0 20px rgba(168,85,247,.04)}.tab-card-grid i,.tab-list i{color:#a855f7;font-size:1.35rem;text-shadow:0 0 16px rgba(168,85,247,.72)}.tab-list{padding:10px;display:grid;gap:8px}.tab-list a{min-height:58px;grid-template-columns:minmax(0,1fr) auto;align-content:center;justify-items:stretch;text-align:left}.tab-contact{padding:10px}.info-section{display:none!important}
    .story-modal{padding:0;background:rgba(0,0,0,.92);backdrop-filter:blur(16px)}.story-card{width:min(460px,100%);height:100vh;border:0;border-radius:0;display:grid;grid-template-rows:1fr auto;background:#05050a;box-shadow:0 0 80px rgba(168,85,247,.48)}.story-card img{width:100%;height:100%;min-height:0;display:block;object-fit:cover;background:#05050a}.story-card h2{margin:0;padding:16px 18px 22px;font-size:1rem;background:linear-gradient(180deg,rgba(5,5,10,.2),rgba(5,5,10,.96))}.story-card .modal-close{top:14px;right:14px;margin:0;z-index:2;background:rgba(5,5,10,.82);box-shadow:0 0 22px rgba(168,85,247,.34)}
  `;
  document.head.appendChild(style);

  const actionRow = document.querySelector('.action-row');
  const highlight = document.querySelector('.highlight-block');
  if (actionRow && highlight && actionRow.nextElementSibling !== highlight) actionRow.insertAdjacentElement('afterend', highlight);

  const dp = document.querySelector('.dp-ring');
  dp?.setAttribute('role', 'button');
  dp?.setAttribute('tabindex', '0');
  dp?.setAttribute('aria-label', 'Open profile story');

  const postsSection = document.querySelector('#posts');
  const postGrid = document.querySelector('#postGrid');
  if (!postsSection || !postGrid || document.querySelector('.profile-tabs')) return;

  const titleSub = postsSection.querySelector('.section-title span');
  if (titleSub) {
    const btn = document.createElement('button');
    btn.className = 'others-toggle';
    btn.id = 'othersToggle';
    btn.type = 'button';
    btn.innerHTML = '<i class="fa-solid fa-layer-group"></i><span>Others</span>';
    titleSub.replaceWith(btn);
  }

  postGrid.classList.add('tab-panel', 'is-active');
  postGrid.dataset.panel = 'posts';

  const tabs = document.createElement('div');
  tabs.className = 'profile-tabs';
  tabs.id = 'profileTabs';
  tabs.hidden = true;
  tabs.setAttribute('aria-label', 'Profile content tabs');
  tabs.innerHTML = `
    <button class="is-active" type="button" data-tab="posts"><i class="fa-solid fa-table-cells"></i><span>Posts</span></button>
    <button type="button" data-tab="skills"><i class="fa-solid fa-code"></i><span>Skills</span></button>
    <button type="button" data-tab="projects"><i class="fa-solid fa-folder-open"></i><span>Projects</span></button>
    <button type="button" data-tab="services"><i class="fa-solid fa-bolt"></i><span>Services</span></button>
    <button type="button" data-tab="contact"><i class="fa-solid fa-message"></i><span>Contact</span></button>
  `;
  postGrid.before(tabs);

  const panels = document.createElement('div');
  panels.innerHTML = `
    <div class="tab-panel tab-card-grid" data-panel="skills" hidden><article><i class="fa-brands fa-android"></i><strong>Android Development</strong></article><article><i class="fa-solid fa-code"></i><strong>Kotlin</strong></article><article><i class="fa-brands fa-python"></i><strong>Python</strong></article><article><i class="fa-solid fa-globe"></i><strong>Web Development</strong></article><article><i class="fa-solid fa-robot"></i><strong>AI Tools</strong></article><article><i class="fa-brands fa-telegram"></i><strong>Telegram Bots</strong></article></div>
    <div class="tab-panel tab-list" data-panel="projects" hidden><a href="#"><span>AI Dashboard</span><i class="fa-solid fa-arrow-up-right-from-square"></i></a><a href="#"><span>Android Creator App</span><i class="fa-solid fa-arrow-up-right-from-square"></i></a><a href="#"><span>Telegram Automation Bot</span><i class="fa-solid fa-arrow-up-right-from-square"></i></a></div>
    <div class="tab-panel tab-card-grid" data-panel="services" hidden><article><i class="fa-solid fa-mobile-screen-button"></i><strong>App UI</strong></article><article><i class="fa-solid fa-code"></i><strong>Websites</strong></article><article><i class="fa-solid fa-robot"></i><strong>AI Projects</strong></article></div>
    <div class="tab-panel contact-options tab-contact" data-panel="contact" hidden><a href="https://wa.me/message/ZSMEU67CK25OF1" target="_blank" rel="noreferrer"><i class="fa-brands fa-whatsapp"></i><span>WhatsApp</span></a><a href="https://t.me/PiyushxHelp_Bot" target="_blank" rel="noreferrer"><i class="fa-brands fa-telegram"></i><span>Telegram Bot</span></a></div>
  `;
  postGrid.after(...Array.from(panels.children));

  const switchTab = (tabName) => {
    tabs.hidden = false;
    document.querySelector('#othersToggle')?.classList.add('is-open');
    document.querySelectorAll('.profile-tabs button').forEach((button) => button.classList.toggle('is-active', button.dataset.tab === tabName));
    document.querySelectorAll('.tab-panel').forEach((panel) => {
      const active = panel.dataset.panel === tabName;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
  };
  tabs.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => switchTab(button.dataset.tab)));
  document.querySelector('#othersToggle')?.addEventListener('click', () => {
    const willOpen = tabs.hidden;
    tabs.hidden = !willOpen;
    document.querySelector('#othersToggle')?.classList.toggle('is-open', willOpen);
    if (willOpen) switchTab('skills');
    else {
      switchTab('posts');
      tabs.hidden = true;
      document.querySelector('#othersToggle')?.classList.remove('is-open');
    }
  });

  const openFirstStory = () => {
    const firstHighlight = document.querySelector('.highlight-item');
    const firstStory = document.querySelector('.story-item');
    if (firstHighlight) firstHighlight.click();
    else if (firstStory) firstStory.click();
  };
  dp?.addEventListener('click', openFirstStory);
  dp?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openFirstStory();
    }
  });
}

window.addEventListener('load', addTabAndStoryEnhancements);
