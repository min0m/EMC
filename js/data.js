const EMC_DATA = {
  projects: [
    { id: '01', title: 'Campus Connect', type: 'React', image: 'assets/images/asset-12.jpg', pitch: 'A student-built directory for discovering clubs, events, and people at ESEN.', stack: ['React', 'Node.js', 'MongoDB'], repo: 'https://github.com/esen-microsoft-club', demo: 'https://github.com/esen-microsoft-club' },
    { id: '02', title: 'Azure Starter Kit', type: 'Azure', image: 'assets/images/asset-15.jpg', pitch: 'A friendly cloud lab that gets first-time builders from zero to their first deployment.', stack: ['Azure', 'GitHub Actions', 'Node.js'], repo: 'https://github.com/esen-microsoft-club', demo: 'https://learn.microsoft.com/training/azure/' },
    { id: '03', title: 'Event Pulse', type: 'Python', image: 'assets/images/asset-20.jpg', pitch: 'A lightweight attendance and feedback dashboard for workshops and hackathons.', stack: ['Python', 'FastAPI', 'SQLite'], repo: 'https://github.com/esen-microsoft-club', demo: 'https://github.com/esen-microsoft-club' },
    { id: '04', title: 'Design Systems Lab', type: 'UI/UX', image: 'assets/images/asset-23.jpg', pitch: 'Reusable components and accessibility patterns for student products that feel coherent.', stack: ['Figma', 'UI/UX', 'Design tokens'], repo: 'https://github.com/esen-microsoft-club', demo: 'https://www.figma.com/' },
    { id: '05', title: 'Open Source Sprints', type: 'Community', image: 'assets/images/asset-27.jpg', pitch: 'A monthly ritual for learning in public, reviewing pull requests, and shipping together.', stack: ['GitHub', 'Open source', 'Mentoring'], repo: 'https://github.com/esen-microsoft-club', demo: 'https://github.com/esen-microsoft-club' },
    { id: '06', title: 'Idea to MVP', type: 'Entrepreneurship', image: 'assets/images/asset-30.jpg', pitch: 'A practical playbook that helps teams frame, pitch, and validate a new idea.', stack: ['Pitching', 'Research', 'Strategy'], repo: 'https://github.com/esen-microsoft-club', demo: 'https://github.com/esen-microsoft-club' }
  ],
  events: [
    { month: 'OCT', day: '03', title: 'Level Up: Build your first API', time: '10:00 – 13:00', place: 'ESEN Lab 2', speaker: 'Project Department', description: 'A hands-on morning for turning an idea into a small, documented API.', start: '20261003T090000Z', end: '20261003T120000Z' },
    { month: 'OCT', day: '10', title: 'EMC Open House', time: '14:00 – 17:00', place: 'ESEN Campus', speaker: 'Executive Bureau', description: 'Meet the people behind EMC, explore each department, and find your first project.', start: '20261010T130000Z', end: '20261010T160000Z' },
    { month: 'OCT', day: '24', title: 'Coding Universe 2026', time: '09:00 – 18:00', place: 'ESEN + Teams', speaker: 'EMC Community', description: 'One day, one brief, many teams. Build a useful prototype with a crew of peers.', start: '20261024T080000Z', end: '20261024T170000Z' }
  ],
  team: [
    { initials: 'AM', name: 'Amina M.', role: 'President', bio: 'Community direction, partnerships, and helping ideas move from conversation to action.', linkedin: 'https://www.linkedin.com/' , github: 'https://github.com/' },
    { initials: 'YS', name: 'Youssef S.', role: 'Vice-President', bio: 'Operations, member experience, and the systems that keep our teams moving.', linkedin: 'https://www.linkedin.com/' , github: 'https://github.com/' },
    { initials: 'NB', name: 'Nour B.', role: 'Project Lead', bio: 'Technical mentoring, project reviews, and creating a safe place to learn by shipping.', linkedin: 'https://www.linkedin.com/' , github: 'https://github.com/' },
    { initials: 'MH', name: 'Mohamed H.', role: 'Talent Acquisition Lead', bio: 'Training tracks, onboarding, and matching curious students with the right first challenge.', linkedin: 'https://www.linkedin.com/' , github: 'https://github.com/' }
  ],
  // The original gallery stored each photo twice (src + fallback). Keep one entry per photo.
  gallery: [
    ['asset-09.jpg', 'Members at a club session', 'community'], ['asset-11.jpg', 'Play with Redix pitch session', 'workshops'], ['asset-13.jpg', 'Team group photo', 'community'], ['asset-15.jpg', 'Filming with the gimbal rig', 'workshops'], ['asset-17.jpg', 'Huddle before the activity', 'events'], ['asset-19.jpg', 'Members between sessions', 'community'], ['asset-21.jpg', 'Registration desk duo', 'events'], ['asset-23.jpg', 'Working through the setup', 'workshops'], ['asset-25.jpg', 'Explaining the Microsoft org structure', 'workshops'], ['asset-27.jpg', 'Speaking at a partner event', 'events'], ['asset-29.jpg', 'Group discussion at a panel', 'community'], ['asset-31.jpg', 'Audience at the Level Up Workshop', 'workshops']
  ]
};
