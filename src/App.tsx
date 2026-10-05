import { useState, useEffect, useRef, useCallback } from 'react'

const WEB3FORMS_KEY = '8facfe1e-1254-4b58-b065-402d86c80537'
const CONTACT_EMAIL = 'microsoft.club@esen.tn'

/* ──────────────── Data ──────────────── */
const PROJECTS = [
  { id:'01', title:'Campus Connect', type:'React', image:'assets/images/asset-12.jpg', pitch:'A student-built directory for discovering clubs, events, and people at ESEN.', stack:['React','Node.js','MongoDB'] },
  { id:'02', title:'Azure Starter Kit', type:'Azure', image:'assets/images/asset-15.jpg', pitch:'A friendly cloud lab that gets first-time builders from zero to their first deployment.', stack:['Azure','GitHub Actions','Node.js'] },
  { id:'03', title:'Event Pulse', type:'Python', image:'assets/images/asset-20.jpg', pitch:'A lightweight attendance and feedback dashboard for workshops and hackathons.', stack:['Python','FastAPI','SQLite'] },
  { id:'04', title:'Design Systems Lab', type:'UI/UX', image:'assets/images/asset-23.jpg', pitch:'Reusable components and accessibility patterns for student products that feel coherent.', stack:['Figma','UI/UX','Design tokens'] },
  { id:'05', title:'Open Source Sprints', type:'Community', image:'assets/images/asset-27.jpg', pitch:'A monthly ritual for learning in public, reviewing pull requests, and shipping together.', stack:['GitHub','Open source','Mentoring'] },
  { id:'06', title:'Idea to MVP', type:'Business', image:'assets/images/asset-30.jpg', pitch:'A practical playbook helping teams frame, pitch, and validate a new idea with the Business dept.', stack:['Pitching','Research','Strategy'] },
]

const TEAM = [
  { initials:'GA', name:'Ghassen Ayari', role:'President', bio:'Leads overall strategy, guides the team, and represents the club.', linkedin:'https://www.linkedin.com/in/ghassen-ayari-907410326', github:'' },
  { initials:'MG', name:'Malek Gouja', role:'Vice President', bio:'Drives execution, supports board members, and steps in when needed.', linkedin:'', github:'' },
  { initials:'AR', name:'Amine Rouatbi', role:'Project Manager', bio:'Directs technical execution, manages timelines, oversees architecture, and ensures project delivery.', linkedin:'https://www.linkedin.com/in/mohamed-amine-32665b395/', github:'' },
  { initials:'ID', name:'Ines Dridi', role:'Talents Manager', bio:'Recruits, empowers, and looks after member development and club culture.', linkedin:'', github:'' },
  { initials:'MA', name:'Maryem Attia', role:'Marketing Manager', bio:'Shapes our brand, runs campaigns, and leads community engagement.', linkedin:'', github:'' },
  { initials:'TH', name:'Taha Hafian', role:'Business Manager', bio:'Manages finances, secures sponsorships, and handles external partnerships.', linkedin:'', github:'' },
  { initials:'NH', name:'Nour Hammami', role:'OCP', bio:'Leads logistical execution and team coordination for flagship events.', linkedin:'', github:'' },
]

const GALLERY = [
  { src:'assets/images/asset-09.jpg', alt:'Members at a club session', cat:'community' },
  { src:'assets/images/asset-11.jpg', alt:'Play with Redix pitch session', cat:'workshops' },
  { src:'assets/images/asset-13.jpg', alt:'Team group photo', cat:'community' },
  { src:'assets/images/asset-15.jpg', alt:'Filming with gimbal rig', cat:'workshops' },
  { src:'assets/images/asset-17.jpg', alt:'Huddle before the activity', cat:'events' },
  { src:'assets/images/asset-19.jpg', alt:'Members between sessions', cat:'community' },
  { src:'assets/images/asset-21.jpg', alt:'Registration desk duo', cat:'events' },
  { src:'assets/images/asset-23.jpg', alt:'Working through the setup', cat:'workshops' },
  { src:'assets/images/asset-25.jpg', alt:'Explaining the Microsoft org structure', cat:'workshops' },
  { src:'assets/images/asset-27.jpg', alt:'Speaking at a partner event', cat:'events' },
  { src:'assets/images/asset-29.jpg', alt:'Group discussion at a panel', cat:'community' },
  { src:'assets/images/asset-31.jpg', alt:'Audience at the Level Up Workshop', cat:'workshops' },
]

const FAQ_ITEMS = [
  { q:'Can first-year students join?', a:'Yes. EMC is designed to help you find your footing, meet people, and learn by doing — no seniority required.' },
  { q:'Do I need prior coding experience?', a:'No. Project, Marketing, Talents, and Business all need different kinds of curiosity. The department quiz can help you choose a first door.' },
  { q:'How much time should I expect?', a:'Most members spend a few hours a week on department work, with more time around events. We care about consistency, not an impossible schedule.' },
  { q:'What happens after I apply?', a:'Applications open once per academic year. When the board reviews a new intake, they contact each applicant by email and invite them to an orientation where you can meet every department before choosing your path.' },
]

/* ──────────────── Terminal commands ──────────────── */
type TermLine = { text: string; cls?: string }

function runCommand(cmd: string): TermLine[] {
  const c = cmd.trim().toLowerCase()
  if (!c) return []
  switch (c) {
    case 'help':
      return [
        { text: 'Available commands:', cls: 'hi' },
        { text: '  about    — who we are' },
        { text: '  events   — event schedule' },
        { text: '  team     — core board members' },
        { text: '  join     — membership status' },
        { text: '  motto    — the EMC motto' },
        { text: '  clear    — clear the screen' },
        { text: '  help     — show this list' },
      ]
    case 'about':
      return [
        { text: 'ESEN Microsoft Club (EMC)', cls: 'hi' },
        { text: 'Student-led tech community at ESEN Manouba.' },
        { text: 'Workshops · Hackathons · Portfolio Projects · MLSA community.' },
        { text: 'No experience required. Everyone is welcome.', cls: 'accent' },
      ]
    case 'events':
      return [
        { text: 'Recent events:', cls: 'hi' },
        { text: '  Integration Day — 30 September 2026, ESEN Campus' },
        { text: '  A full day to meet your people and find your department.' },
        { text: 'More events will be announced soon.', cls: 'accent' },
      ]
    case 'team':
      return [
        { text: 'Core Board 2026:', cls: 'hi' },
        ...TEAM.map(m => ({ text: `  ${m.role.padEnd(20)} ${m.name}` })),
      ]
    case 'join':
      return [
        { text: 'Joining EMC:', cls: 'hi' },
        { text: '  1. Recruitment opens once per academic year' },
        { text: '  2. Applications close when the intake is full' },
        { text: '  3. Welcome Session, then pick a department' },
        { text: 'Applications are open — see #join-us.', cls: 'accent' },
      ]
    case 'motto':
      return [
        { text: 'Build. Learn. Connect. Lead.', cls: 'hi' },
        { text: '— ESEN Microsoft Club' },
      ]
    case 'clear':
      return [{ text: '__CLEAR__' }]
    default:
      return [{ text: `Command not found: ${cmd}`, cls: 'err' }, { text: 'Type \`help\` for available commands.' }]
  }
}

/* ──────────────── Main App ──────────────── */
export default function App() {
  // Theme
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme) }, [theme])

  // Mobile menu
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  // Scroll progress
  const [scrollPct, setScrollPct] = useState(0)
  // Scrolled header
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const pct = el.scrollTop / (el.scrollHeight - el.clientHeight)
      setScrollPct(pct)
      setScrolled(el.scrollTop > 40)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active nav section
  const [activeSection, setActiveSection] = useState('home')
  useEffect(() => {
    const sections = ['home','about','projects','events','resources','join-us','shell']
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id) })
    }, { threshold: 0.25 })
    sections.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  // Project filter
  const [projectFilter, setProjectFilter] = useState('All')
  const filterLabels = ['All','React','Azure','Python','UI/UX']
  const filteredProjects = projectFilter === 'All' ? PROJECTS : PROJECTS.filter(p => p.type === projectFilter)

  // FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Gallery
  const [galleryFilter, setGalleryFilter] = useState('all')
  const [lightbox, setLightbox] = useState<typeof GALLERY[0] | null>(null)
  const filteredGallery = galleryFilter === 'all' ? GALLERY : GALLERY.filter(g => g.cat === galleryFilter)

  // Terminal
  const [termLines, setTermLines] = useState<TermLine[]>([
    { text: 'ESEN Microsoft Club Interactive Shell v1.0', cls: 'hi' },
    { text: 'Type \`help\` to see available commands.' },
    { text: '' },
  ])
  const [termInput, setTermInput] = useState('')
  const termScreenRef = useRef<HTMLDivElement>(null)
  const termInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (termScreenRef.current) termScreenRef.current.scrollTop = termScreenRef.current.scrollHeight
  }, [termLines])

  const submitTermCmd = (e: React.FormEvent) => {
    e.preventDefault()
    const cmd = termInput.trim()
    if (!cmd) return
    const output = runCommand(cmd)
    if (output.length === 1 && output[0].text === '__CLEAR__') {
      setTermLines([{ text: 'Screen cleared.', cls: 'accent' }])
    } else {
      setTermLines(prev => [...prev, { text: cmd, cls: 'cmd' }, ...output, { text: '' }])
    }
    setTermInput('')
  }

  // Quiz
  const quizSteps = [
    { q: 'What sounds most satisfying?', opts: [{ label: 'Making a real thing work', dept: 'Project' }, { label: 'Making people care about an idea', dept: 'Marketing' }, { label: 'Helping someone learn a new skill', dept: 'Talents' }] },
    { q: 'What would your ideal Saturday look like?', opts: [{ label: 'Turning a rough idea into a partnership', dept: 'Business' }, { label: 'Pairing on a side project', dept: 'Project' }, { label: 'Shooting and editing a campaign', dept: 'Marketing' }] },
    { q: 'What do friends ask you for?', opts: [{ label: 'Explaining tricky things', dept: 'Talents' }, { label: 'Spotting the opportunity', dept: 'Business' }, { label: 'Fixing or building things', dept: 'Project' }] },
  ]
  const [quizStep, setQuizStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<string[]>([])
  const [quizResult, setQuizResult] = useState<string | null>(null)

  const handleQuizAnswer = (dept: string) => {
    const newAnswers = [...quizAnswers, dept]
    if (quizStep < quizSteps.length - 1) {
      setQuizAnswers(newAnswers)
      setQuizStep(s => s + 1)
    } else {
      const freq: Record<string, number> = {}
      newAnswers.forEach(d => { freq[d] = (freq[d] || 0) + 1 })
      const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0]
      setQuizResult(top)
    }
  }

  const resetQuiz = () => { setQuizStep(0); setQuizAnswers([]); setQuizResult(null) }

  const [appValues, setAppValues] = useState({ name: '', email: '', study_level: '', department: '', message: '' })
  const [appErrors, setAppErrors] = useState<Record<string, string>>({})
  const [appStatus, setAppStatus] = useState<{ kind: 'idle' | 'sending' | 'error'; msg: string }>({ kind: 'idle', msg: '' })
  const [appBot, setAppBot] = useState(false)
  const [appSent, setAppSent] = useState(false)

  const setAppField = (field: string, value: string) => {
    setAppValues(v => ({ ...v, [field]: value }))
    setAppErrors(e => {
      if (!e[field]) return e
      const next = { ...e }
      delete next[field]
      return next
    })
  }

  const validateApp = () => {
    const errors: Record<string, string> = {}
    if (!appValues.name.trim()) errors.name = 'Please enter your name.'
    if (!appValues.email.trim()) errors.email = 'Please enter your email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(appValues.email.trim())) errors.email = 'Please enter a valid email.'
    if (!appValues.study_level) errors.study_level = 'Please choose your study level.'
    if (!appValues.department) errors.department = 'Please choose a department.'
    return errors
  }

  const submitApplication = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (appBot) return
    const errors = validateApp()
    setAppErrors(errors)
    if (Object.keys(errors).length) {
      setAppStatus({ kind: 'error', msg: 'Please complete the highlighted fields before sending.' })
      const first = document.querySelector<HTMLInputElement>('.application-card .has-error .form-input, .application-card .has-error .form-select')
      first?.focus()
      return
    }

    setAppStatus({ kind: 'sending', msg: 'Sending your application…' })
    const body = new FormData()
    body.append('access_key', WEB3FORMS_KEY)
    body.append('subject', 'New ESEN Microsoft Club Application')
    body.append('from_name', 'ESEN Microsoft Club Recruitment')
    body.append('name', appValues.name.trim())
    body.append('email', appValues.email.trim())
    body.append('study_level', appValues.study_level)
    body.append('department', appValues.department)
    body.append('message', appValues.message.trim())

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 10000)
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body,
        signal: controller.signal,
      })
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error(result.message || 'Submission failed')
      clearTimeout(timer)
      setAppSent(true)
    } catch (err) {
      clearTimeout(timer)
      const aborted = err instanceof Error && err.name === 'AbortError'
      setAppStatus({ kind: 'error', msg: aborted ? 'The request timed out. Please try again.' : 'We could not send that just now. Please try again or email the club directly.' })
    }
  }

  const resetApplication = () => {
    setAppValues({ name: '', email: '', study_level: '', department: '', message: '' })
    setAppErrors({})
    setAppStatus({ kind: 'idle', msg: '' })
    setAppSent(false)
  }

  // Nav links
  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#events', label: 'Events' },
    { href: '#resources', label: 'Learn' },
    { href: '#shell', label: 'Shell' },
  ]

  const navClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    closeMenu()
  }, [])

  return (
    <>
      {/* Scroll progress */}
      <div className="scroll-progress" style={{ transform: `scaleX(${scrollPct})` }} aria-hidden="true" />

      {/* Skip link */}
      <a className="skip-link" href="#main">Skip to content</a>

      {/* ── Header ── */}
      <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
        <div className="container nav-wrap">
          <a className="brand" href="#home" onClick={e => navClick(e as any, 'home')} aria-label="EMC home">
            <div style={{ width:36, height:36, borderRadius:'var(--radius)', background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="7" height="7" fill="white" rx="1"/>
                <rect x="11" y="2" width="7" height="7" fill="rgba(255,255,255,0.6)" rx="1"/>
                <rect x="2" y="11" width="7" height="7" fill="rgba(255,255,255,0.6)" rx="1"/>
                <rect x="11" y="11" width="7" height="7" fill="white" rx="1"/>
              </svg>
            </div>
            <span className="brand-name">ESEN Microsoft Club<small>ESEN · Manouba</small></span>
          </a>

          <nav className="desktop-nav" aria-label="Primary">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className={activeSection === l.href.slice(1) ? 'active' : ''} onClick={e => navClick(e, l.href.slice(1))}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            <button className="theme-toggle" onClick={toggleTheme} type="button" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
              <span className="theme-icon" aria-hidden="true" />
            </button>
            <a className="button button-primary nav-join" href="#join-us" onClick={e => navClick(e as any, 'join-us')}>Join EMC</a>
            <button className={`menu-toggle${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(o => !o)} type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
              <span /><span />
            </button>
          </div>

          <nav className={`mobile-menu${menuOpen ? ' open' : ''}`} aria-label="Mobile">
            {navLinks.map(l => <a key={l.href} href={l.href} onClick={e => navClick(e, l.href.slice(1))}>{l.label}</a>)}
            <a href="#archive" onClick={e => navClick(e, 'archive')}>Archive</a>
            <a href="#faq" onClick={e => navClick(e, 'faq')}>FAQ</a>
            <a className="mobile-join" href="#join-us" onClick={e => navClick(e, 'join-us')}>Join EMC</a>
          </nav>
        </div>
      </header>

      <main id="main">

        {/* ── Hero ── */}
        <section className="hero" id="home">
          <div className="hero-media" aria-hidden="true">
            <img
              src="assets/images/asset-02.jpg"
              alt=""
              fetchPriority="high"
            />
          </div>
          <div className="hero-overlay" aria-hidden="true" />
          <div className="hero-grid" aria-hidden="true" />
          <div className="container hero-content">
            <p className="hero-brand">ESEN Microsoft Club</p>
            <p className="hero-status">
              <span className="live-dot" aria-hidden="true" />
              New chapter · MLSA program community
            </p>
            <h1>Build, innovate,<br />and grow with us.</h1>
            <p className="hero-lead">A student-led tech community at ESEN bridging tech, innovation, and business — workshops, hackathons, and portfolio projects. No experience required.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#events" onClick={e => navClick(e as any, 'events')}>See events</a>
              <a className="button button-ghost" href="#about" onClick={e => navClick(e as any, 'about')}>Meet the club</a>
            </div>
          </div>
        </section>

        {/* Marquee */}
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[1,2].map(i => (
              <span key={i} className="marquee-group" aria-hidden={i===2}>
                Workshops&nbsp;✦&nbsp;Hackathons&nbsp;✦&nbsp;Cloud&nbsp;✦&nbsp;AI&nbsp;✦&nbsp;Dev&nbsp;✦&nbsp;Portfolio Projects&nbsp;✦&nbsp;Open Source&nbsp;✦&nbsp;Design&nbsp;✦&nbsp;Business&nbsp;✦&nbsp;Community&nbsp;✦&nbsp;
              </span>
            ))}
          </div>
        </div>

        {/* ── About ── */}
        <section className="section about-section" id="about">
          <div className="container">
            <div className="about-grid">
              <div className="about-intro">
                <span className="eyebrow">About us</span>
                <h2>Learn by doing.<br />Launch real careers.</h2>
                <p>We are a student-led tech community at ESEN bridging the gap between tech, innovation, and business.</p>
              </div>
              <ul className="about-points">
                {[
                  { t:'What we do', d:'Hands-on workshops (Cloud, AI, Dev), hackathons, and real-world portfolio projects.' },
                  { t:'Why we exist', d:'Help students gain practical skills and launch tech careers — no experience required.' },
                  { t:'Mission', d:'Empower ESEN students with skills, experience, and a collaborative network.' },
                  { t:'Vision', d:"ESEN's premier tech hub where curiosity becomes impactful digital innovation." },
                ].map(({ t, d }) => (
                  <li key={t}>
                    <strong>{t}</strong>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="values-row" aria-label="Core values">
              {[
                { h:'Integrity', p:'We hold ourselves to the highest ethical standards.' },
                { h:'Collaboration', p:'Teamwork, creativity, and shared success.' },
                { h:'Excellence', p:'We strive for improvement and deliver strong results.' },
              ].map(({ h, p }) => (
                <article key={h}>
                  <h3>{h}</h3>
                  <p>{p}</p>
                </article>
              ))}
            </div>

            <div className="dept-strip" aria-label="Departments">
              {[
                { n:'01', h:'Project', p:'Technical execution, architecture, and shipping portfolio-ready builds.' },
                { n:'02', h:'Marketing', p:'Brand, campaigns, and community engagement across campus.' },
                { n:'03', h:'Talents', p:'Recruitment, member development, onboarding, and club culture.' },
                { n:'04', h:'Business', p:'Finances, sponsorships, partnerships, and external relations.' },
              ].map(({ n, h, p }) => (
                <article key={n}>
                  <span className="dept-num">{n}</span>
                  <h3>{h}</h3>
                  <p>{p}</p>
                </article>
              ))}
            </div>

            <dl className="stat-row">
              <div><dt>50+</dt><dd>Events in our first mandate</dd></div>
              <div><dt>04</dt><dd>Departments</dd></div>
              <div><dt>07</dt><dd>Core board roles</dd></div>
              <div><dt>MLSA</dt><dd>Program community</dd></div>
            </dl>
          </div>
        </section>

        {/* ── Projects ── */}
        <section className="section projects-section" id="projects">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Projects</span>
                <h2>Work with receipts.</h2>
              </div>
              <p className="heading-note">Student-built tools and experiments. Filter by stack and see what the club is shipping.</p>
            </div>

            <div className="section-toolbar">
              <div className="filter-tabs" role="group" aria-label="Filter projects">
                {filterLabels.map(f => (
                  <button key={f} className={`filter-tab${projectFilter === f ? ' active' : ''}`} type="button" onClick={() => setProjectFilter(f)}>{f}</button>
                ))}
              </div>
              <span className="toolbar-note">Open source · Student-led</span>
            </div>

            <div className="project-grid">
              {filteredProjects.map(p => (
                <article key={p.id} className="project-card">
                  <div className="project-card-img">
                    <img src={p.image} alt={p.title} loading="lazy" />
                  </div>
                  <div className="project-card-body">
                    <div className="project-card-meta">
                      <span className="project-id">{p.id}</span>
                      <span className="project-type">{p.type}</span>
                    </div>
                    <h3>{p.title}</h3>
                    <p>{p.pitch}</p>
                    <div className="project-stack">
                      {p.stack.map(s => <span key={s} className="stack-tag">{s}</span>)}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Events ── */}
        <section className="section events-section" id="events">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Events</span>
                <h2>Show up. Leave with something new.</h2>
              </div>
              <p className="heading-note">Workshops, open houses, and build days. Save a date, bring a friend.</p>
            </div>

            <div className="events-layout">
              <div className="event-list">
                <article className="event-item">
                  <div className="event-date">
                    <div className="event-day">30</div>
                    <div className="event-month">SEP</div>
                  </div>
                  <div className="event-body">
                    <h3>Integration Day</h3>
                    <div className="event-details">
                      <span className="event-detail">30 September 2026</span>
                      <span className="event-detail">ESEN Campus</span>
                      <span className="event-detail">EMC Community</span>
                    </div>
                    <p className="event-description">A full day to meet your people, find your department, and build your first thing with EMC. This edition has wrapped up — catch the recap in the reel, and watch this space for the next one.</p>
                    <div className="event-actions">
<a className="button button-secondary button-small" href="#join-us" onClick={e => navClick(e as any, 'join-us')}>Membership info</a>
                      <a className="button button-ghost button-small" href="https://www.instagram.com/p/Dd9eqFFg24h/" target="_blank" rel="noopener noreferrer">Watch reel</a>
                    </div>
                  </div>
                </article>
              </div>

              <aside className="events-aside">
                <figure className="events-photo">
                  <img src="assets/images/asset-13.jpg" alt="EMC members at a campus event" loading="lazy" />
                  <figcaption>Past sessions · Coding Universe · Level Up</figcaption>
                </figure>
                <p>The room is part of the work. Browse photos from workshops and hackathons in the archive.</p>
                <a className="text-link" href="#archive" onClick={e => navClick(e as any, 'archive')}>Open the photo archive <span aria-hidden="true">→</span></a>
              </aside>
            </div>
          </div>
        </section>

        {/* ── Resources ── */}
        <section className="section resources-section" id="resources">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Learn</span>
                <h2>Keep going between sessions.</h2>
              </div>
              <p className="heading-note">Short, opinionated paths — plus student perks you can use today.</p>
            </div>

            <div className="resource-grid">
              {[
                { n:'01', h:'Web development', p:'HTML and CSS foundations through your first full-stack project.', href:'https://developer.mozilla.org/en-US/docs/Learn', link:'MDN Learn ↗' },
                { n:'02', h:'Cloud fundamentals', p:'Core cloud concepts and your first Azure deployment.', href:'https://learn.microsoft.com/training/azure/', link:'Microsoft Learn ↗' },
                { n:'03', h:'AI & data', p:'Ask better questions of data, models, and the products around you.', href:'https://learn.microsoft.com/training/paths/get-started-with-artificial-intelligence-on-azure/', link:'AI starter path ↗' },
                { n:'04', h:'UI / UX', p:'Turn fuzzy ideas into flows, prototypes, and usable interfaces.', href:'https://www.figma.com/resources/learn-design/', link:'Figma resources ↗' },
              ].map(({ n, h, p, href, link }) => (
                <article key={n} className="resource-card">
                  <span className="resource-index">{n}</span>
                  <h3>{h}</h3>
                  <p>{p}</p>
                  <a className="text-link" href={href} target="_blank" rel="noopener">{link}</a>
                </article>
              ))}
            </div>

            <div className="perks-block">
              <div className="perks-intro">
                <span className="eyebrow">Member benefits</span>
                <h3>What you get when you join</h3>
              </div>
              <ul className="perk-links">
                {[
                  { href:'#projects', t:'Portfolio projects', d:'Ship-ready work to showcase on your CV', internal:true },
                  { href:'#events', t:'Hackathons & events', d:'Test skills, win prizes, tackle team challenges', internal:true },
                  { href:'https://learn.microsoft.com/training/', t:'Industry certifications', d:'Guided support for Microsoft credentials', internal:false },
                ].map(({ href, t, d, internal }) => (
                  <li key={t}>
                    <a href={href} {...(!internal ? { target:'_blank', rel:'noopener' } : {})} onClick={internal ? e => navClick(e as any, href.slice(1)) : undefined}>
                      <strong>{t}</strong>
                      <small>{d}</small>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Join ── */}
        <section className="section join-section" id="join-us">
          <div className="container join-layout">
            <div className="join-intro">
              <span className="eyebrow">Join</span>
              <h2>There's room for your idea.</h2>
              <p className="lead">No prior experience required. Bring a question, a skill, or the willingness to show up.</p>

              <ol className="roadmap">
                {[
                  { n:'01', t:'Keep an eye out', d:'We open a new intake every academic year.' },
                  { n:'02', t:'Welcome session · October', d:'Meet departments and pick a first project.' },
                  { n:'03', t:'Build with us', d:'Learn in public and contribute all year.' },
                ].map(({ n, t, d }) => (
                  <li key={n}>
                    <span className="roadmap-num">{n}</span>
                    <div>
                      <strong>{t}</strong>
                      <small>{d}</small>
                    </div>
                  </li>
                ))}
              </ol>

              {/* Quiz */}
              <div className="quiz-card">
                <div className="quiz-head">
                  <span className="eyebrow">Department matcher</span>
                  <span className="quiz-count">{quizResult ? 'Done' : `0${quizStep+1} / 03`}</span>
                </div>
                <h3>Not sure where to start?</h3>
                <div className="quiz-progress" aria-hidden="true">
                  <div className="quiz-progress-bar" style={{ width: quizResult ? '100%' : `${((quizStep)/quizSteps.length)*100}%` }} />
                </div>
                {quizResult ? (
                  <div className="quiz-result">
                    <span className="muted">Your strongest match is</span>
                    <strong>{quizResult}</strong>
                    <p className="muted">No wrong answer — use this as your first door into EMC.</p>
                    <button className="button button-secondary button-small" type="button" onClick={resetQuiz}>Try again</button>
                  </div>
                ) : (
                  <div className="quiz-question active">
                    <p>{quizSteps[quizStep].q}</p>
                    <div className="quiz-options">
                      {quizSteps[quizStep].opts.map(o => (
                        <button key={o.label} className="quiz-option" type="button" onClick={() => handleQuizAnswer(o.dept)}>{o.label}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Application form */}
            <div className="application-card">
              <div className="application-top">
                <span className="status"><i aria-hidden="true" /> Recruitment open · Fall 2026</span>
                <span className="application-code">EMC / 2026</span>
              </div>

              {appSent ? (
                <div className="success-state visible">
                  <div className="success-mark" aria-hidden="true">✓</div>
                  <h3>Application received.</h3>
                  <p className="muted">Thanks for applying — check your inbox for a reply from the board. We read every application.</p>
                  <div className="event-actions">
                    <button className="button button-secondary button-small" type="button" onClick={resetApplication}>Send another</button>
                    <a className="button button-ghost button-small" href="#events" onClick={e => navClick(e as any, 'events')}>See events</a>
                  </div>
                </div>
              ) : (
                <>
                  <h3>Apply to join</h3>
                  <p className="muted">A few details help us welcome you into the right conversation.</p>
                  <form onSubmit={submitApplication} noValidate>
                    <input
                      className="honeypot"
                      type="checkbox"
                      name="botcheck"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      checked={appBot}
                      onChange={e => setAppBot(e.target.checked)}
                    />
                    <div className="form-grid">
                      <div className={`form-group${appErrors.name ? ' has-error' : ''}`}>
                        <label htmlFor="fullname">Full name <span className="req">*</span></label>
                        <input
                          className="form-input"
                          id="fullname"
                          name="name"
                          type="text"
                          placeholder="e.g. Anis Mansour"
                          autoComplete="name"
                          aria-invalid={appErrors.name ? 'true' : 'false'}
                          aria-describedby="fullname-error"
                          value={appValues.name}
                          onChange={e => setAppField('name', e.target.value)}
                        />
                        <span className="form-error" id="fullname-error">{appErrors.name}</span>
                      </div>
                      <div className={`form-group${appErrors.email ? ' has-error' : ''}`}>
                        <label htmlFor="email">Email <span className="req">*</span></label>
                        <input
                          className="form-input"
                          id="email"
                          name="email"
                          type="email"
                          placeholder="name@domain.com"
                          autoComplete="email"
                          aria-invalid={appErrors.email ? 'true' : 'false'}
                          aria-describedby="email-error"
                          value={appValues.email}
                          onChange={e => setAppField('email', e.target.value)}
                        />
                        <span className="form-error" id="email-error">{appErrors.email}</span>
                      </div>
                      <div className={`form-group${appErrors.study_level ? ' has-error' : ''}`}>
                        <label htmlFor="level">Study level <span className="req">*</span></label>
                        <select
                          className="form-select"
                          id="level"
                          name="study_level"
                          aria-invalid={appErrors.study_level ? 'true' : 'false'}
                          aria-describedby="level-error"
                          value={appValues.study_level}
                          onChange={e => setAppField('study_level', e.target.value)}
                        >
                          <option value="">Select your year</option>
                          {['1st Year License', '2nd Year License', '3rd Year License', '1st Year Master', '2nd Year Master'].map(o => <option key={o}>{o}</option>)}
                        </select>
                        <span className="form-error" id="level-error">{appErrors.study_level}</span>
                      </div>
                      <div className={`form-group${appErrors.department ? ' has-error' : ''}`}>
                        <label htmlFor="department">Preferred department <span className="req">*</span></label>
                        <select
                          className="form-select"
                          id="department"
                          name="department"
                          aria-invalid={appErrors.department ? 'true' : 'false'}
                          aria-describedby="department-error"
                          value={appValues.department}
                          onChange={e => setAppField('department', e.target.value)}
                        >
                          <option value="">Choose a department</option>
                          {['Project', 'Talents', 'Marketing', 'Business'].map(o => <option key={o}>{o}</option>)}
                        </select>
                        <span className="form-error" id="department-error">{appErrors.department}</span>
                      </div>
                      <div className="form-group full">
                        <label htmlFor="motivation">What do you want to explore?</label>
                        <textarea
                          className="form-textarea"
                          id="motivation"
                          name="message"
                          rows={4}
                          placeholder="An interest, skill, or idea…"
                          value={appValues.message}
                          onChange={e => setAppField('message', e.target.value)}
                        />
                      </div>
                    </div>
                    <button className="button button-primary submit-button" type="submit" disabled={appStatus.kind === 'sending'}>
                      {appStatus.kind === 'sending' ? 'Sending…' : 'Send application'}
                    </button>
                    <p className="form-note">We only use your details to respond to this application.</p>
                    <p className={`form-status${appStatus.kind === 'error' ? ' error' : ''}`} role="status" aria-live="polite">{appStatus.msg}</p>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── Interactive Shell ── */}
        <section className="section shell-section" id="shell">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Interactive shell</span>
                <h2>Type a command.</h2>
              </div>
              <p className="heading-note">A tiny CLI for the curious. Try <code>help</code>, <code>about</code>, <code>events</code>, <code>team</code>, <code>join</code>, or <code>motto</code>.</p>
            </div>

            <div className="terminal" role="application" aria-label="EMC interactive shell" onClick={() => termInputRef.current?.focus()}>
              <div className="terminal-bar">
                <span className="terminal-dots" aria-hidden="true"><i /><i /><i /></span>
                <span className="terminal-title">guest@emc ~/shell</span>
                <span className="terminal-safe" aria-hidden="true">●</span>
              </div>
              <div className="terminal-screen" ref={termScreenRef} aria-live="polite">
                {termLines.map((line, i) => (
                  <div key={i} className={`terminal-line${line.cls ? ` ${line.cls}` : ''}`}>{line.text || ' '}</div>
                ))}
              </div>
              <form className="terminal-input" onSubmit={submitTermCmd} autoComplete="off">
                <span className="terminal-prompt" aria-hidden="true">guest@emc:~$</span>
                <input
                  ref={termInputRef}
                  id="terminalCmd"
                  type="text"
                  aria-label="Type a shell command"
                  spellCheck={false}
                  autoComplete="off"
                  value={termInput}
                  onChange={e => setTermInput(e.target.value)}
                />
              </form>
            </div>
          </div>
        </section>

        {/* ── Archive ── */}
        <section className="section archive-section" id="archive">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Archive</span>
                <h2>Proof of life.</h2>
              </div>
              <p className="heading-note">People, projects, and small moments from the sessions that keep EMC moving.</p>
            </div>

            <div className="gallery-toolbar">
              <span className="toolbar-note">Select a photo to enlarge</span>
              <div className="filter-tabs" role="group" aria-label="Filter photo archive">
                {(['all','events','workshops','community'] as const).map(f => (
                  <button key={f} className={`filter-tab${galleryFilter === f ? ' active' : ''}`} type="button" onClick={() => setGalleryFilter(f)}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="gallery-grid">
              {filteredGallery.map((g, i) => (
                <button
                  key={i}
                  className="gallery-card"
                  type="button"
                  aria-label={`View photo: ${g.alt}`}
                  onClick={() => setLightbox(g)}
                >
                  <img src={g.src} alt={g.alt} loading="lazy" />
                  <div className="gallery-card-overlay" aria-hidden="true">
                    <span className="gallery-cat">{g.cat}</span>
                    <span className="gallery-caption">{g.alt}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="section faq-section" id="faq">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">FAQ</span>
                <h2>Before you jump in.</h2>
              </div>
              <p className="heading-note">Still curious? Joining a session is the fastest answer. Here are the basics.</p>
            </div>

            <div className="faq-list">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className={`faq-item${openFaq === i ? ' open' : ''}`}>
                  <button
                    className="faq-trigger"
                    type="button"
                    aria-expanded={openFaq === i}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    {item.q}
                    <span aria-hidden="true">+</span>
                  </button>
                  <div className="faq-answer" role="region">
                    <p>{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Lightbox modal */}
      {lightbox && (
        <div className="modal open" role="dialog" aria-modal="true" aria-label={lightbox.alt} onClick={e => { if (e.target === e.currentTarget) setLightbox(null) }}>
          <div className="modal-box">
            <button className="modal-close" type="button" aria-label="Close photo" onClick={() => setLightbox(null)}>×</button>
            <img src={lightbox.src.replace('w=400&h=400', 'w=900&h=600')} alt={lightbox.alt} />
            <div className="modal-meta">
              <small>{lightbox.cat}</small>
              <h3>{lightbox.alt}</h3>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <a className="brand" href="#home" onClick={e => navClick(e as any, 'home')}>
                <div style={{ width:36, height:36, borderRadius:'var(--radius)', background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <rect x="2" y="2" width="7" height="7" fill="white" rx="1"/>
                    <rect x="11" y="2" width="7" height="7" fill="rgba(255,255,255,0.6)" rx="1"/>
                    <rect x="2" y="11" width="7" height="7" fill="rgba(255,255,255,0.6)" rx="1"/>
                    <rect x="11" y="11" width="7" height="7" fill="white" rx="1"/>
                  </svg>
                </div>
                <span className="brand-name">ESEN Microsoft Club<small>Build · Learn · Connect · Lead</small></span>
              </a>
              <p className="footer-intro">Student-led tech community at ESEN Manouba — bridging tech, innovation, and business.</p>
              <div className="social-row">
                <a href="https://www.instagram.com/esen_microsoft.club/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3>Explore</h3>
              <a href="#projects" onClick={e => navClick(e as any, 'projects')}>Projects</a>
              <a href="#events" onClick={e => navClick(e as any, 'events')}>Events</a>
              <a href="#shell" onClick={e => navClick(e as any, 'shell')}>Shell</a>
              <a href="#archive" onClick={e => navClick(e as any, 'archive')}>Archive</a>
            </div>
            <div>
              <h3>Learn</h3>
              <a href="#resources" onClick={e => navClick(e as any, 'resources')}>Field guide</a>
              <a href="https://learn.microsoft.com/training/" target="_blank" rel="noopener">Microsoft Learn</a>
              <a href="https://education.github.com/pack" target="_blank" rel="noopener">Student Pack</a>
              <a href="#faq" onClick={e => navClick(e as any, 'faq')}>FAQ</a>
            </div>
            <div>
              <h3>Campus</h3>
              <a href="http://www.esen.tn/" target="_blank" rel="noopener">ESEN Manouba</a>
              <a href="https://studentambassadors.microsoft.com/" target="_blank" rel="noopener">Microsoft Learn Student Ambassadors</a>
              <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT_EMAIL)}`} target="_blank" rel="noopener noreferrer">{CONTACT_EMAIL}</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} ESEN Microsoft Club</span>
            <span>Made by students · Tunisia</span>
          </div>
        </div>
      </footer>
    </>
  )
}
