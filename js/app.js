const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const data = typeof EMC_DATA !== 'undefined' ? EMC_DATA : (window.EMC_DATA || {});
const safeArray = value => Array.isArray(value) ? value : [];

function escapeHTML(value = '') {
  return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

function showToast(message) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('visible'), 4200);
}

function initTheme() {
  const saved = localStorage.getItem('emc-theme');
  if (saved === 'light' || saved === 'dark') document.documentElement.dataset.theme = saved;
  const toggle = $('#themeToggle');
  if (!toggle) return;
  const sync = () => {
    const light = document.documentElement.dataset.theme === 'light';
    toggle.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
    toggle.firstElementChild.textContent = light ? 'L' : 'D';
  };
  sync();
  toggle.addEventListener('click', () => {
    document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('emc-theme', document.documentElement.dataset.theme);
    sync();
  });
}

function initNavigation() {
  const menu = $('#mobileMenu');
  const menuButton = $('#menuToggle');
  if (menu && menuButton) {
    menuButton.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    });
    $$('#mobileMenu a').forEach(link => link.addEventListener('click', () => {
      menu.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation menu');
    }));
  }
  const sections = $$('main section[id]');
  const links = $$('.desktop-nav a, #mobileMenu a, .rail-nav a, .mobile-bottom-nav a');
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  }), { rootMargin: '-28% 0px -62% 0px' });
  sections.forEach(section => observer.observe(section));
}

function renderProjects() {
  const grid = $('#projectGrid');
  if (!grid) return;
  const projects = safeArray(data.projects);
  const render = (filter = 'All') => {
    const items = projects.filter(project => filter === 'All' || project.type === filter || safeArray(project.stack).includes(filter));
    if (!items.length) {
      grid.innerHTML = '<div class="empty-state"><strong>No projects in this lane yet.</strong><span>Try another filter or check back after the next build sprint.</span></div>';
      return;
    }
    grid.innerHTML = items.map((project, index) => `<article class="project-card spotlight-card${index === 0 && filter === 'All' ? ' featured' : ''}"><div class="project-visual"><img src="${escapeHTML(project.image)}" alt="${escapeHTML(project.title)} project preview" loading="lazy"><span class="project-index">${escapeHTML(project.id || String(index + 1).padStart(2, '0'))} / ${escapeHTML(project.type || 'Project')}</span></div><div class="project-body"><h3>${escapeHTML(project.title)}</h3><p>${escapeHTML(project.pitch)}</p><div class="pill-row">${safeArray(project.stack).map(item => `<span class="pill">${escapeHTML(item)}</span>`).join('')}</div><div class="project-links"><a href="${escapeHTML(project.repo || '#')}" target="_blank" rel="noopener">↗ Repository</a><a href="${escapeHTML(project.demo || '#')}" target="_blank" rel="noopener">↗ Live / Guide</a></div></div></article>`).join('');
    initSpotlights(grid);
  };
  render();
  $$('.filter-tab[data-project-filter]').forEach(tab => tab.addEventListener('click', () => {
    $$('.filter-tab[data-project-filter]').forEach(item => item.classList.remove('active'));
    tab.classList.add('active');
    render(tab.dataset.projectFilter);
  }));
}

function createCalendarEvent(event) {
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//EMC//Community Calendar//EN', 'BEGIN:VEVENT', `DTSTART:${event.start}`, `DTEND:${event.end}`, `SUMMARY:${event.title}`, `LOCATION:${event.place}`, `DESCRIPTION:${event.description}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast('Calendar file downloaded — see you there.');
}

function formatEventDate(start) {
  const match = String(start || '').match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/);
  return match ? `${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6]}Z` : '';
}

function updateCountdowns() {
  $$('.countdown').forEach(label => {
    const target = new Date(label.dataset.start).getTime();
    if (!Number.isFinite(target)) { label.textContent = ''; return; }
    const remaining = target - Date.now();
    if (remaining <= 0) { label.textContent = 'Happening now'; return; }
    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining % 86400000) / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    label.textContent = days ? `in ${days}d ${hours}h` : `in ${hours}h ${minutes}m`;
  });
}

function renderEvents() {
  const list = $('#eventList');
  if (!list) return;
  const events = safeArray(data.events);
  if (!events.length) { list.innerHTML = '<div class="empty-state"><strong>No events are scheduled yet.</strong><span>Follow the club channels for the next session announcement.</span></div>'; return; }
  list.innerHTML = events.map((event, index) => `<article class="event-card spotlight-card"><div class="event-date"><strong>${escapeHTML(event.day || '--')}</strong><span>${escapeHTML(event.month || '')}</span></div><div><span class="eyebrow">${index === events.length - 1 ? 'Flagship event' : 'Upcoming'}</span> <span class="countdown" data-start="${formatEventDate(event.start)}"></span><h3>${escapeHTML(event.title)}</h3><p class="muted">${escapeHTML(event.description)}</p><div class="event-detail"><span>${escapeHTML(event.time)}</span><span>${escapeHTML(event.place)}</span><span>${escapeHTML(event.speaker)}</span></div><div class="event-actions"><a class="button button-primary button-small" href="#join-us" data-rsvp="${escapeHTML(event.title)}">RSVP / Save a spot</a><button class="button button-secondary button-small calendar-button" type="button" data-event="${index}">Add to calendar</button></div></div></article>`).join('');
  updateCountdowns();
  clearInterval(renderEvents.timer);
  renderEvents.timer = setInterval(updateCountdowns, 60000);
  $$('.calendar-button', list).forEach(button => button.addEventListener('click', () => createCalendarEvent(events[Number(button.dataset.event)])));
  $$('[data-rsvp]', list).forEach(button => button.addEventListener('click', () => {
    const motivation = $('#motivation');
    if (motivation) { motivation.value = `I would like to RSVP for ${button.dataset.rsvp}.`; showToast('RSVP noted — finish the application when you are ready.'); }
  }));
  initSpotlights(list);
}

function renderTeam() {
  const grid = $('#teamGrid');
  if (!grid) return;
  const team = safeArray(data.team);
  grid.innerHTML = team.length ? team.map(member => `<article class="team-card spotlight-card"><div class="avatar">${escapeHTML(member.initials)}</div><span class="team-role">${escapeHTML(member.role)}</span><h3>${escapeHTML(member.name)}</h3><p>${escapeHTML(member.bio)}</p><div class="social-mini"><a href="${escapeHTML(member.linkedin || '#')}" target="_blank" rel="noopener">LinkedIn ↗</a><a href="${escapeHTML(member.github || '#')}" target="_blank" rel="noopener">GitHub ↗</a></div></article>`).join('') : '<div class="empty-state"><strong>The team directory is between updates.</strong><span>Meet the crew at the next open house.</span></div>';
  initSpotlights(grid);
}

function renderGallery() {
  const grid = $('#galleryGrid');
  if (!grid) return;
  const gallery = safeArray(data.gallery);
  let currentFilter = 'all';
  const render = () => {
    const items = gallery.filter(item => currentFilter === 'all' || item[2] === currentFilter);
    if (!items.length) { grid.innerHTML = '<div class="empty-state"><strong>No frames in this collection yet.</strong><span>Try another archive filter.</span></div>'; return; }
    grid.innerHTML = items.map((item, index) => `<button class="gallery-card" type="button" data-gallery-index="${index}"><img src="assets/images/${escapeHTML(item[0])}" alt="${escapeHTML(item[1])}" loading="lazy"><span class="gallery-caption"><small>${escapeHTML(item[2])}</small>${escapeHTML(item[1])}</span></button>`).join('');
    $$('.gallery-card', grid).forEach(card => card.addEventListener('click', () => openGallery(items[Number(card.dataset.galleryIndex)])));
  };
  render();
  $$('.filter-tab[data-gallery-filter]').forEach(tab => tab.addEventListener('click', () => {
    $$('.filter-tab[data-gallery-filter]').forEach(item => item.classList.remove('active'));
    tab.classList.add('active'); currentFilter = tab.dataset.galleryFilter; render();
  }));
}

let lastFocusedElement;
function openGallery(item) {
  if (!item) return;
  const modal = $('#galleryModal');
  lastFocusedElement = document.activeElement;
  $('img', modal).src = `assets/images/${item[0]}`; $('img', modal).alt = item[1]; $('small', modal).textContent = item[2]; $('#modalTitle', modal).textContent = item[1];
  modal.classList.add('visible'); modal.setAttribute('aria-hidden', 'false'); $('#modalClose').focus();
}
function closeGallery() { const modal = $('#galleryModal'); modal.classList.remove('visible'); modal.setAttribute('aria-hidden', 'true'); if (lastFocusedElement) lastFocusedElement.focus(); }

function initQuiz() {
  const questions = $$('.quiz-question'); const progress = $('#quizProgress'); const count = $('#quizCount'); const result = $('#quizResult'); const answers = [];
  if (!questions.length || !progress || !result) return;
  const setStep = step => { questions.forEach((question, index) => question.classList.toggle('active', index === step)); progress.style.width = `${((step + 1) / questions.length) * 100}%`; if (count) count.textContent = `${String(step + 1).padStart(2, '0')} / ${String(questions.length).padStart(2, '0')}`; };
  setStep(0);
  $$('.quiz-option').forEach(option => option.addEventListener('click', () => {
    const current = Number(option.closest('.quiz-question').dataset.step) - 1; answers[current] = option.dataset.answer;
    if (current < questions.length - 1) setStep(current + 1); else { questions.forEach(question => question.classList.remove('active')); const counts = answers.reduce((accumulator, answer) => { accumulator[answer] = (accumulator[answer] || 0) + 1; return accumulator; }, {}); const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Project'; $('#quizResultName').textContent = winner; result.classList.add('visible'); progress.style.width = '100%'; if (count) count.textContent = 'MATCH FOUND'; }
  }));
  $('#quizReset').addEventListener('click', () => { answers.length = 0; result.classList.remove('visible'); setStep(0); });
}

function initFaq() { $$('.faq-trigger').forEach(trigger => trigger.addEventListener('click', () => { const item = trigger.closest('.faq-item'); const open = item.classList.toggle('open'); trigger.setAttribute('aria-expanded', String(open)); })); }

function initForm() {
  const form = $('#recruitmentForm'); if (!form) return;
  const fields = ['fullname', 'email', 'level', 'department']; const submit = $('#submitApplication'); const status = $('#formStatus');
  const validate = () => fields.reduce((valid, id) => { const input = $(`#${id}`); const group = input.closest('.form-group'); const invalid = !input.value.trim() || (id === 'email' && !input.validity.valid); group.classList.toggle('has-error', invalid); input.setAttribute('aria-invalid', String(invalid)); return valid && !invalid; }, true);
  fields.forEach(id => $(`#${id}`).addEventListener('input', () => { const input = $(`#${id}`); input.closest('.form-group').classList.remove('has-error'); input.setAttribute('aria-invalid', 'false'); if (status) status.textContent = ''; }));
  form.addEventListener('submit', async event => {
    event.preventDefault(); if (!validate()) { if (status) { status.className = 'form-status error'; status.textContent = 'Please complete the highlighted fields before sending.'; } showToast('Please complete the highlighted fields.'); return; }
    if ($('[name="botcheck"]', form).checked) return;
    submit.disabled = true; submit.innerHTML = 'Sending…'; if (status) { status.className = 'form-status'; status.textContent = 'Sending your application securely…'; }
    try {
      const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(form.action, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form), signal: controller.signal }); clearTimeout(timeout);
      const result = await response.json(); if (!response.ok || !result.success) throw new Error(result.message || 'Submission failed');
      form.classList.add('hidden'); $('#successState').classList.add('visible'); showToast('Application received — check your inbox for confirmation.');
    } catch (error) { submit.disabled = false; submit.innerHTML = 'Send application <b>↗</b>'; if (status) { status.className = 'form-status error'; status.textContent = error.name === 'AbortError' ? 'The request timed out. Please try again.' : 'We could not send that just now. Please try again or email the club directly.'; } }
  });
  $('#resetForm').addEventListener('click', () => { form.reset(); fields.forEach(id => { const input = $(`#${id}`); input.closest('.form-group').classList.remove('has-error'); input.setAttribute('aria-invalid', 'false'); }); form.classList.remove('hidden'); $('#successState').classList.remove('visible'); submit.disabled = false; submit.innerHTML = 'Send application <b>↗</b>'; if (status) status.textContent = ''; });
}

function initSpotlights(root = document) { if (window.matchMedia('(pointer: coarse)').matches) return; $$('.spotlight-card', root).forEach(card => { if (card.dataset.spotlightReady) return; card.dataset.spotlightReady = 'true'; card.addEventListener('pointermove', event => { const box = card.getBoundingClientRect(); card.style.setProperty('--mouse-x', `${event.clientX - box.left}px`); card.style.setProperty('--mouse-y', `${event.clientY - box.top}px`); }); }); }
function initMagneticButtons() { if (window.matchMedia('(pointer: coarse)').matches) return; $$('.magnetic').forEach(button => { const strength = Number(button.dataset.magneticStrength) || 10; button.addEventListener('pointermove', event => { const box = button.getBoundingClientRect(); const x = (event.clientX - box.left - box.width / 2) / box.width * strength; const y = (event.clientY - box.top - box.height / 2) / box.height * strength; button.style.transform = `translate(${x}px, ${y}px)`; }); button.addEventListener('pointerleave', () => { button.style.transform = ''; }); }); }

document.addEventListener('DOMContentLoaded', () => {
  initTheme(); initNavigation(); renderProjects(); renderEvents(); renderTeam(); renderGallery(); initQuiz(); initFaq(); initForm(); initSpotlights(); initMagneticButtons();
  $('#currentYear').textContent = new Date().getFullYear();
  $('#modalClose').addEventListener('click', closeGallery); $('#galleryModal').addEventListener('click', event => { if (event.target.id === 'galleryModal') closeGallery(); }); document.addEventListener('keydown', event => { if (event.key === 'Escape' && $('#galleryModal').classList.contains('visible')) closeGallery(); });
});
