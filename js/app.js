const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const data = typeof EMC_DATA !== 'undefined' ? EMC_DATA : (window.EMC_DATA || {});
const safeArray = value => Array.isArray(value) ? value : [];

function escapeHTML(value = '') {
  return String(value).replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));
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
  if (saved === 'light' || saved === 'dark') {
    document.documentElement.dataset.theme = saved;
  }
  const toggle = $('#themeToggle');
  if (!toggle) return;
  const sync = () => {
    const light = document.documentElement.dataset.theme === 'light';
    toggle.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      light ? '#eef1f5' : '#12151a'
    );
  };
  sync();
  toggle.addEventListener('click', () => {
    document.documentElement.dataset.theme =
      document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
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
      menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    $$('#mobileMenu a').forEach(link => link.addEventListener('click', () => {
      menu.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open menu');
    }));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.classList.contains('open')) {
        menu.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open menu');
        menuButton.focus();
      }
    });
  }

  const sections = $$('main section[id]');
  const links = $$('.desktop-nav a, #mobileMenu a');
  if (!('IntersectionObserver' in window) || !sections.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-30% 0px -55% 0px' });
  sections.forEach(section => observer.observe(section));
}

function renderProjects() {
  const grid = $('#projectGrid');
  if (!grid) return;
  const projects = safeArray(data.projects);
  const render = (filter = 'All') => {
    const items = projects.filter(project =>
      filter === 'All' ||
      project.type === filter ||
      safeArray(project.stack).includes(filter)
    );
    if (!items.length) {
      grid.innerHTML = '<div class="empty-state" role="status"><strong>No projects in this lane yet.</strong><span>Try another filter or check back after the next build sprint.</span></div>';
      return;
    }
    grid.innerHTML = items.map((project, index) => `
      <article class="project-card${index === 0 && filter === 'All' ? ' featured' : ''}">
        <div class="project-visual">
          <img src="${escapeHTML(project.image)}" alt="${escapeHTML(project.title)} project preview" loading="lazy" width="640" height="360">
          <span class="project-index">${escapeHTML(project.id || String(index + 1).padStart(2, '0'))} / ${escapeHTML(project.type || 'Project')}</span>
        </div>
        <div class="project-body">
          <h3>${escapeHTML(project.title)}</h3>
          <p>${escapeHTML(project.pitch)}</p>
          <div class="pill-row">${safeArray(project.stack).map(item => `<span class="pill">${escapeHTML(item)}</span>`).join('')}</div>
        </div>
      </article>
    `).join('');
    observeReveals(grid);
  };
  render();
  $$('.filter-tab[data-project-filter]').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.filter-tab[data-project-filter]').forEach(item => item.classList.remove('active'));
      tab.classList.add('active');
      render(tab.dataset.projectFilter);
    });
  });
}

function createCalendarEvent(event) {
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//EMC//Community Calendar//EN',
    'BEGIN:VEVENT',
    `DTSTART:${event.start}`, `DTEND:${event.end}`,
    `SUMMARY:${event.title}`, `LOCATION:${event.place}`,
    `DESCRIPTION:${event.description}`,
    'END:VEVENT', 'END:VCALENDAR'
  ].join('\r\n');
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
    if (!Number.isFinite(target)) {
      label.textContent = '';
      return;
    }
    const remaining = target - Date.now();
    if (remaining <= 0) {
      label.textContent = 'Happening now';
      return;
    }
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
  if (!events.length) {
    list.innerHTML = '<div class="empty-state" role="status"><strong>No events are scheduled yet.</strong><span>Follow the club channels for the next session announcement.</span></div>';
    return;
  }
  list.innerHTML = events.map((event, index) => {
    const isTBA = !event.start;
    return `
    <article class="event-card">
      <div class="event-date">
        <strong>${escapeHTML(event.day || '--')}</strong>
        <span>${escapeHTML(event.month || '')}</span>
      </div>
      <div>
        <span class="eyebrow">${events.length === 1 ? 'Our focus' : (index === events.length - 1 ? 'Flagship' : 'Upcoming')}</span>
        ${isTBA
          ? '<span class="countdown tba">Date to be announced</span>'
          : `<span class="countdown" data-start="${formatEventDate(event.start)}"></span>`}
        <h3>${escapeHTML(event.title)}</h3>
        <p class="muted">${escapeHTML(event.description)}</p>
        <div class="event-detail">
          <span>${escapeHTML(event.time)}</span>
          <span>${escapeHTML(event.place)}</span>
          <span>${escapeHTML(event.speaker)}</span>
        </div>
        <div class="event-actions">
          <a class="button button-primary button-small" href="#join-us" data-rsvp="${escapeHTML(event.title)}">Get notified</a>
          ${isTBA ? '' : `<button class="button button-secondary button-small calendar-button" type="button" data-event="${index}">Add to calendar</button>`}
        </div>
        <a class="text-link rsvp-cta" href="#business-reserve">Business owners — reserve a spot <span aria-hidden="true">→</span></a>
      </div>
    </article>
  `;
  }).join('');
  updateCountdowns();
  clearInterval(renderEvents.timer);
  if ($$('.countdown[data-start]', list).length) {
    renderEvents.timer = setInterval(updateCountdowns, 60000);
  }
  $$('.calendar-button', list).forEach(button => {
    button.addEventListener('click', () => createCalendarEvent(events[Number(button.dataset.event)]));
  });
  $$('[data-rsvp]', list).forEach(button => {
    button.addEventListener('click', () => {
      const motivation = $('#motivation');
      if (motivation) {
        motivation.value = `I would like to join the ${button.dataset.rsvp}.`;
        showToast('Noted — we will keep you posted on the date.');
      }
    });
  });
  observeReveals(list);
}

function isPlaceholderLink(url) {
  const value = String(url || '').trim().replace(/\/+$/, '');
  return !value || value === 'https://www.linkedin.com' || value === 'https://github.com';
}

function renderBoardCard(member) {
  const social = [
    !isPlaceholderLink(member.linkedin)
      ? `<a href="${escapeHTML(member.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>` : '',
    !isPlaceholderLink(member.github)
      ? `<a href="${escapeHTML(member.github)}" target="_blank" rel="noopener">GitHub</a>` : ''
  ].filter(Boolean).join('');
  const photo = member.photo
    ? `<img src="${escapeHTML(member.photo)}" alt="${escapeHTML(member.name)}" width="400" height="533" loading="lazy">`
    : `<span class="board-monogram" aria-hidden="true">${escapeHTML(member.initials)}</span>`;
  return `
    <article class="board-card">
      <div class="board-photo">
        ${photo}
        <span class="board-role">${escapeHTML(member.role)}</span>
      </div>
      <div class="board-body">
        <h3>${escapeHTML(member.name)}</h3>
        <p>${escapeHTML(member.bio)}</p>
        ${social ? `<div class="social-mini">${social}</div>` : ''}
      </div>
    </article>`;
}

function initBoard() {
  const track = $('#boardTrack');
  const dotsWrap = $('#boardDots');
  const prev = $('#boardPrev');
  const next = $('#boardNext');
  if (!track || !dotsWrap || !prev || !next) return;
  const team = safeArray(data.team);
  if (!team.length) {
    track.innerHTML = '<div class="empty-state" role="status"><strong>The board directory is between updates.</strong><span>Meet the crew at the next open house.</span></div>';
    prev.disabled = true;
    next.disabled = true;
    return;
  }
  const isLeadership = member => member.role === 'President' || member.role === 'Vice President';
  const isManager = member => /manager/i.test(member.role);
  const operations = team.filter(member => !isLeadership(member) && !isManager(member));
  const groups = [
    { name: 'Leadership', members: team.filter(isLeadership) },
    { name: 'Departments', members: team.filter(isManager) }
  ];
  if (operations.length) groups.push({ name: 'Operations', members: operations });

  const slides = groups.filter(group => group.members.length);
  const columnClass = slide => slide.members.length === 1
    ? 'has-1'
    : (slide.members.length === 2 ? 'has-2' : 'has-4');

  track.innerHTML = slides.map((slide, index) => `
    <div class="board-slide ${columnClass(slide)}" aria-label="${escapeHTML(slide.name)}">
      <div class="board-slide-head">
        <span class="board-slide-index" aria-hidden="true">${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}</span>
        <h3 class="board-slide-title">${escapeHTML(slide.name)}</h3>
        <span class="board-slide-count">${slide.members.length} ${slide.members.length === 1 ? 'member' : 'members'}</span>
      </div>
      <div class="board-cards">${slide.members.map(renderBoardCard).join('')}</div>
    </div>
  `).join('');

  dotsWrap.innerHTML = slides.map((slide, index) =>
    `<button class="board-dot" type="button" data-page="${index}" aria-label="Go to ${escapeHTML(slide.name)} — page ${index + 1}"></button>`
  ).join('');

  const dots = $$('.board-dot', dotsWrap);
  const slideEls = $$('.board-slide', track);
  let current = 0;

  const setPage = index => {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(${-current * 100}%)`;
    slideEls.forEach((el, i) => {
      const active = i === current;
      el.classList.toggle('is-active', active);
      el.setAttribute('aria-hidden', String(!active));
      if (active) el.removeAttribute('inert');
      else el.setAttribute('inert', '');
    });
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
    prev.disabled = slides.length <= 1;
    next.disabled = slides.length <= 1;
  };

  prev.addEventListener('click', () => setPage(current - 1));
  next.addEventListener('click', () => setPage(current + 1));
  dots.forEach(dot => dot.addEventListener('click', () => setPage(Number(dot.dataset.page))));
  setPage(0);
}

function renderGallery() {
  const grid = $('#galleryGrid');
  if (!grid) return;
  const gallery = safeArray(data.gallery);
  let currentFilter = 'all';
  const render = () => {
    const items = gallery.filter(item => currentFilter === 'all' || item[2] === currentFilter);
    if (!items.length) {
      grid.innerHTML = '<div class="empty-state" role="status"><strong>No frames in this collection yet.</strong><span>Try another archive filter.</span></div>';
      return;
    }
    grid.innerHTML = items.map((item, index) => `
      <button class="gallery-card" type="button" data-gallery-index="${index}">
        <img src="assets/images/${escapeHTML(item[0])}" alt="${escapeHTML(item[1])}" loading="lazy" width="400" height="400">
        <span class="gallery-caption"><small>${escapeHTML(item[2])}</small>${escapeHTML(item[1])}</span>
      </button>
    `).join('');
    $$('.gallery-card', grid).forEach(card => {
      card.addEventListener('click', () => openGallery(items[Number(card.dataset.galleryIndex)]));
    });
    observeReveals(grid);
  };
  render();
  $$('.filter-tab[data-gallery-filter]').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.filter-tab[data-gallery-filter]').forEach(item => item.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.galleryFilter;
      render();
    });
  });
}

let lastFocusedElement;

function openGallery(item) {
  if (!item) return;
  const modal = $('#galleryModal');
  lastFocusedElement = document.activeElement;
  $('img', modal).src = `assets/images/${item[0]}`;
  $('img', modal).alt = item[1];
  $('small', modal).textContent = item[2];
  $('#modalTitle', modal).textContent = item[1];
  modal.classList.add('visible');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  $('#modalClose').focus();
}

function closeGallery() {
  const modal = $('#galleryModal');
  modal.classList.remove('visible');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocusedElement) lastFocusedElement.focus();
}

function initQuiz() {
  const questions = $$('.quiz-question');
  const progress = $('#quizProgress');
  const count = $('#quizCount');
  const result = $('#quizResult');
  const answers = [];
  if (!questions.length || !progress || !result) return;

  const setStep = step => {
    questions.forEach((question, index) => question.classList.toggle('active', index === step));
    progress.style.width = `${((step + 1) / questions.length) * 100}%`;
    if (count) {
      count.textContent = `${String(step + 1).padStart(2, '0')} / ${String(questions.length).padStart(2, '0')}`;
    }
  };
  setStep(0);

  $$('.quiz-option').forEach(option => {
    option.addEventListener('click', () => {
      const current = Number(option.closest('.quiz-question').dataset.step) - 1;
      answers[current] = option.dataset.answer;
      if (current < questions.length - 1) {
        setStep(current + 1);
      } else {
        questions.forEach(question => question.classList.remove('active'));
        const counts = answers.reduce((acc, answer) => {
          acc[answer] = (acc[answer] || 0) + 1;
          return acc;
        }, {});
        const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Project';
        $('#quizResultName').textContent = winner;
        result.classList.add('visible');
        progress.style.width = '100%';
        if (count) count.textContent = 'MATCH';
        const dept = $('#department');
        if (dept && [...dept.options].some(o => o.value === winner)) {
          dept.value = winner;
        }
      }
    });
  });

  $('#quizReset')?.addEventListener('click', () => {
    answers.length = 0;
    result.classList.remove('visible');
    setStep(0);
  });
}

function initFaq() {
  $$('.faq-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item');
      const open = item.classList.toggle('open');
      trigger.setAttribute('aria-expanded', String(open));
    });
  });
}

function bindAjaxForm(formId, options) {
  const form = $(formId);
  if (!form) return null;
  const fields = options.fields;
  const submit = $(options.submitEl);
  const status = $(options.statusEl);
  const success = $(options.successEl);
  const reset = options.resetEl ? $(options.resetEl) : null;
  const messages = options.messages;

  const validate = () => fields.reduce((valid, field) => {
    const input = $(`#${field.id}`);
    const group = input.closest('.form-group');
    const value = input.value.trim();
    let invalid = !value;
    if (!invalid && field.type === 'email') invalid = !input.validity.valid;
    if (!invalid && field.type === 'phone') invalid = !/^\+?[()\d][()\d\s.-]{5,19}$/.test(value);
    group.classList.toggle('has-error', invalid);
    input.setAttribute('aria-invalid', String(invalid));
    return valid && !invalid;
  }, true);

  fields.forEach(field => {
    const input = $(`#${field.id}`);
    input.addEventListener('input', () => {
      input.closest('.form-group').classList.remove('has-error');
      input.setAttribute('aria-invalid', 'false');
      if (status) status.textContent = '';
    });
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!validate()) {
      if (status) {
        status.className = 'form-status error';
        status.textContent = messages.invalid;
      }
      showToast(messages.invalid);
      $('.form-group.has-error .form-input, .form-group.has-error .form-select', form)?.focus();
      return;
    }
    if ($('[name="botcheck"]', form)?.checked) return;
    submit.disabled = true;
    submit.textContent = messages.buttonSending;
    if (status) {
      status.className = 'form-status';
      status.textContent = messages.sending;
    }
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
        signal: controller.signal
      });
      clearTimeout(timeout);
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Submission failed');
      form.classList.add('hidden');
      if (success) success.classList.add('visible');
      showToast(messages.ok);
    } catch (error) {
      submit.disabled = false;
      submit.textContent = messages.submitIdle;
      if (status) {
        status.className = 'form-status error';
        status.textContent = error.name === 'AbortError' ? messages.timeout : messages.network;
      }
    }
  });

  if (reset) {
    reset.addEventListener('click', () => {
      form.reset();
      fields.forEach(field => {
        const input = $(`#${field.id}`);
        input.closest('.form-group').classList.remove('has-error');
        input.setAttribute('aria-invalid', 'false');
      });
      form.classList.remove('hidden');
      if (success) success.classList.remove('visible');
      submit.disabled = false;
      submit.textContent = messages.submitIdle;
      if (status) status.textContent = '';
    });
  }
  return form;
}

function initForm() {
  bindAjaxForm('#recruitmentForm', {
    fields: [
      { id: 'fullname', type: '' },
      { id: 'email', type: 'email' },
      { id: 'level', type: '' },
      { id: 'department', type: '' }
    ],
    submitEl: '#submitApplication',
    statusEl: '#formStatus',
    successEl: '#successState',
    resetEl: '#resetForm',
    messages: {
      invalid: 'Please complete the highlighted fields before sending.',
      sending: 'Sending your application…',
      buttonSending: 'Sending…',
      ok: 'Application received — check your inbox.',
      timeout: 'The request timed out. Please try again.',
      network: 'We could not send that just now. Please try again or email the club directly.',
      submitIdle: 'Send application'
    }
  });
}

function initBusinessForm() {
  bindAjaxForm('#businessForm', {
    fields: [
      { id: 'bizName', type: '' },
      { id: 'bizBusiness', type: '' },
      { id: 'bizEmail', type: 'email' },
      { id: 'bizPhone', type: 'phone' }
    ],
    submitEl: '#submitBusiness',
    statusEl: '#businessStatus',
    successEl: '#businessSuccess',
    resetEl: '#businessReset',
    messages: {
      invalid: 'Please complete the highlighted fields before reserving.',
      sending: 'Reserving your spot…',
      buttonSending: 'Reserving…',
      ok: 'Spot reserved — we will contact you about Integration Day.',
      timeout: 'The request timed out. Please try again.',
      network: 'We could not send that just now. Please try again or email the club directly.',
      submitIdle: 'Reserve a place'
    }
  });
}

function shellWrite(screen, text, className = '') {
  const line = document.createElement('div');
  line.className = `terminal-line${className ? ` ${className}` : ''}`;
  line.textContent = text;
  screen.appendChild(line);
  screen.scrollTop = screen.scrollHeight;
}

function initShell() {
  const screen = $('#terminalScreen');
  const form = $('#terminalForm');
  const input = $('#terminalCmd');
  if (!screen || !form || !input) return;

  const history = [];
  let historyIndex = -1;

  const banner = [
    'ESEN Microsoft Club · interactive shell',
    `Members connected: ${data.team.length} · Focus event: ${data.events[0] ? data.events[0].title : 'TBA'}`,
    'Type "help" to see what I can do.'
  ];
  banner.forEach(line => shellWrite(screen, line));

  const responses = {
    help() {
      const rows = [
        ['help', 'show this menu'],
        ['about', 'what EMC is about'],
        ['events', 'next club event'],
        ['team', 'who runs the club'],
        ['join', 'how to get involved'],
        ['motto', 'our motto'],
        ['whoami', 'who you are here'],
        ['clear', 'clear the screen']
      ];
      const width = Math.max(...rows.map(r => r[0].length));
      rows.forEach(row => shellWrite(screen, `  ${row[0].padEnd(width)}   ${row[1]}`, 'dim'));
    },
    about() {
      shellWrite(screen, 'EMC is ESEN\'s student-led technology community.', '');
      shellWrite(screen, 'We run hands-on workshops (Cloud, AI, Dev), hackathons, and');
      shellWrite(screen, 'real portfolio projects. No experience required — curiosity is enough.', '');
      shellWrite(screen, 'Departments: Project · Marketing · Talents · Business', 'hl');
    },
    events() {
      const next = (data.events || [])[0];
      if (!next) { shellWrite(screen, 'No events scheduled yet. Check back soon.', 'err'); return; }
      shellWrite(screen, `NEXT ON THE CALENDAR — ${next.title.toUpperCase()}`, 'ok');
      shellWrite(screen, `  Date : ${next.month} ${next.day}, ${next.time}`, '');
      shellWrite(screen, `  Place: ${next.place}`, '');
      shellWrite(screen, `  By   : ${next.speaker}`, '');
      shellWrite(screen, `  ${next.description}`, 'dim');
    },
    team() {
      const team = data.team || [];
      if (!team.length) { shellWrite(screen, 'No team members found.', 'err'); return; }
      const board = team.map(member => `  ${member.role.padEnd(18)} ${member.name}`).join('\n');
      shellWrite(screen, `THE BOARD (${team.length})`, 'ok');
      shellWrite(screen, board, '');
    },
    join() {
      shellWrite(screen, 'Applications are open for Fall 2026.', 'ok');
      shellWrite(screen, 'Find the right department with the quiz, then hit "Apply to join".', '');
      shellWrite(screen, 'Jump: scroll to the join section — or type a department you like:', '');
      shellWrite(screen, '  project · marketing · talents · business', 'hl');
    },
    motto() {
      shellWrite(screen, '“Build, innovate, and grow with us.”', 'warn');
      shellWrite(screen, '— learn by doing, launch real careers.', 'dim');
    },
    whoami() {
      shellWrite(screen, 'guest', '');
      shellWrite(screen, 'A future EMC builder, hopefully. → #join-us', 'hl');
    },
    clear() {
      screen.innerHTML = '';
    }
  };

  const commands = Object.keys(responses);

  function runCommand(raw) {
    const trimmed = raw.trim();
    shellWrite(screen, `guest@emc:~$ ${trimmed}`, 'cmd');
    if (!trimmed) return;
    const [name, ...args] = trimmed.toLowerCase().split(/\s+/);
    const handler = responses[name];
    if (handler) handler(...args);
    else shellWrite(screen, `command not found: ${name}. Try "help".`, 'err');
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const value = input.value;
    if (value.trim()) history.push(value);
    historyIndex = history.length;
    runCommand(value);
    input.value = '';
  });

  input.addEventListener('keydown', event => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!history.length) return;
      historyIndex = Math.max(0, historyIndex - 1);
      input.value = history[historyIndex];
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex < history.length) historyIndex += 1;
      input.value = historyIndex < history.length ? history[historyIndex] : '';
    } else if (event.key === 'Tab') {
      event.preventDefault();
      const typed = input.value.toLowerCase().trim();
      if (!typed) return;
      const matches = commands.filter(command => command.startsWith(typed));
      if (matches.length === 1) input.value = matches[0];
    }
  });

  input.focus();
}

const REVEAL_SELECTOR = [
  '.hero-content > *',
  '.section-heading',
  '.about-intro',
  '.about-points li',
  '.values-row article',
  '.dept-strip article',
  '.stat-row > div',
  '.project-card',
  '.event-card',
  '.events-aside',
  '.business-rsvp',
  '.board',
  '.resource-card',
  '.perks-block',
  '.terminal',
  '.join-intro > *',
  '.application-card',
  '.gallery-card',
  '.faq-item'
].join(', ');

let revealObserver;

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function observeReveals(root = document) {
  const scope = root instanceof Element ? root : document;

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    $$(REVEAL_SELECTOR, scope).forEach(el => el.classList.add('is-visible'));
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  }

  const unique = [...new Set($$(REVEAL_SELECTOR, scope))];
  const delayGroups = new Map();

  unique.forEach(el => {
    if (el.dataset.revealReady) return;
    el.dataset.revealReady = 'true';
    el.classList.add('reveal');

    if (el.matches('.events-aside, .application-card')) {
      el.classList.add('reveal-left');
    } else if (el.matches('.hero-content > *, .stat-row > div')) {
      el.classList.add('reveal-scale');
    } else {
      const section = el.closest('section[id]');
      if (section) {
        const sectionIndex = $$('main section[id]').indexOf(section);
        el.classList.add(sectionIndex % 2 === 0 ? 'reveal-right' : 'reveal-left');
      }
    }

    const parent = el.parentElement;
    if (parent) {
      const index = delayGroups.get(parent) ?? 0;
      delayGroups.set(parent, index + 1);
      el.style.setProperty('--reveal-delay', `${Math.min(index, 7) * 55}ms`);
    }

    revealObserver.observe(el);
  });
}

function initScrollProgress() {
  const bar = $('#scrollProgress');
  if (!bar) return;
  const update = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const progress = max > 0 ? Math.min(doc.scrollTop / max, 1) : 0;
    bar.style.transform = `scaleX(${progress})`;
  };
  update();
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }, { passive: true });
}

function initHeaderShadow() {
  const header = $('.site-header');
  if (!header) return;
  const update = () => header.classList.toggle('scrolled', window.scrollY > 12);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

function initCounters() {
  const counters = $$('[data-count]');
  if (!counters.length) return;
  const finish = el => {
    const pad = Number(el.dataset.pad || 0);
    const value = Number(el.dataset.count);
    const text = pad ? String(value).padStart(pad, '0') : String(value);
    el.textContent = text + (el.dataset.suffix || '');
  };
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    counters.forEach(finish);
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const el = entry.target;
      const target = Number(el.dataset.count);
      const pad = Number(el.dataset.pad || 0);
      const suffix = el.dataset.suffix || '';
      const duration = 1100;
      const start = performance.now();
      const tick = now => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        el.textContent = String(pad ? String(value).padStart(pad, '0') : value) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  counters.forEach(el => observer.observe(el));
}

function initHeroParallax() {
  const media = $('.hero-media');
  if (!media || prefersReducedMotion() || window.innerWidth < 768) return;
  let ticking = false;
  const update = () => {
    const y = Math.min(window.scrollY * 0.16, 90);
    media.style.transform = `translate3d(0, ${y}px, 0)`;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });
  update();
}

function initSlideRail() {
  const rail = $('#slideRail');
  if (!rail) return;
  const sections = $$('main section[id]');
  if (!sections.length) return;
  rail.innerHTML = sections.map(section => {
    const eyebrow = section.querySelector('.eyebrow');
    const label = eyebrow
      ? eyebrow.textContent.trim()
      : (section.id === 'home' ? 'Intro' : section.id);
    return `
      <button class="slide-rail-dot" type="button" data-rail-target="${section.id}" aria-label="Go to ${escapeHTML(label)}">
        <span class="slide-rail-label">${escapeHTML(label)}</span>
      </button>`;
  }).join('');
  const dots = $$('.slide-rail-dot', rail);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        dots.forEach(dot => dot.classList.toggle('active', dot.dataset.railTarget === entry.target.id));
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    sections.forEach(section => observer.observe(section));
  }
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = document.getElementById(dot.dataset.railTarget);
      if (target) target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    });
  });
}

function initDeckKeys() {
  document.addEventListener('keydown', event => {
    const down = event.key === 'ArrowDown' || event.key === 'PageDown';
    const up = event.key === 'ArrowUp' || event.key === 'PageUp';
    if (!down && !up) return;
    const active = document.activeElement;
    if (active && /^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName)) return;
    if ($('#galleryModal')?.classList.contains('visible')) return;
    const sections = $$('main section[id]');
    if (!sections.length) return;
    event.preventDefault();
    const tops = sections.map(section => section.getBoundingClientRect().top + window.scrollY);
    const band = 96;
    let current = sections.length - 1;
    while (current > 0 && tops[current] - band > window.scrollY) current -= 1;
    let next;
    if (down) next = current < sections.length - 1 ? current + 1 : -1;
    else next = current > 0 ? current - 1 : -1;
    if (next === -1) return;
    sections[next].scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  });
}

function initReveal() {
  observeReveals(document);
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initSlideRail();
  initDeckKeys();
  renderProjects();
  renderEvents();
  initBoard();
  renderGallery();
  initQuiz();
  initFaq();
  initForm();
  initBusinessForm();
  initShell();
  initScrollProgress();
  initHeaderShadow();
  initCounters();
  initHeroParallax();
  initReveal();
  const year = $('#currentYear');
  if (year) year.textContent = String(new Date().getFullYear());
  $('#modalClose')?.addEventListener('click', closeGallery);
  $('#galleryModal')?.addEventListener('click', event => {
    if (event.target.id === 'galleryModal') closeGallery();
  });
  document.addEventListener('keydown', event => {
    const modal = $('#galleryModal');
    if (event.key === 'Escape' && modal?.classList.contains('visible')) {
      closeGallery();
      return;
    }
    if (event.key === 'Tab' && modal?.classList.contains('visible')) {
      const focusable = $$('button, [href], [tabindex]:not([tabindex="-1"])', modal)
        .filter(el => el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        last.focus();
        event.preventDefault();
      } else if (!event.shiftKey && document.activeElement === last) {
        first.focus();
        event.preventDefault();
      }
    }
  });
});
