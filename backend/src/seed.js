'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const env = require('./config/env');

const Admin = require('./models/Admin');
const Profile = require('./models/Profile');
const Skill = require('./models/Skill');
const Experience = require('./models/Experience');
const Project = require('./models/Project');
const Education = require('./models/Education');

// ── Seed Data ─────────────────────────────────────────────────────────────────

const ADMIN_DATA = {
  email: env.ADMIN_EMAIL,
  passwordHash: env.ADMIN_PASSWORD,
  name: 'Darshan Nayak',
};

const PROFILE_DATA = {
  name: 'Darshan Nayak',
  title: 'Software Engineer 2',
  typewriterTitles: ['Angular Developer', 'Frontend Architect', 'Full-Stack Engineer'],
  bio: `I'm a passionate Software Engineer with 4+ years of experience building scalable, 
  high-performance web applications. I specialize in Angular and the broader JavaScript ecosystem, 
  with a proven track record of delivering micro-frontend architectures, enterprise CRM tools, 
  and seamless user experiences across fintech, real estate, retail, and hospitality domains.
  
  I thrive at the intersection of design and engineering — crafting pixel-perfect UIs backed by 
  clean, maintainable code. Currently at Terralogic Software Solutions, I'm building a 
  next-generation Network Management Tool for Fujitsu's 1Finity platform using cutting-edge 
  Angular micro-frontend architecture.`,
  photoUrl: '',
  resumeUrl: '/api/v1/resume/download',
  socials: {
    linkedin: 'https://bit.ly/darshanlinkedin',
    email: 'nayakdarshan22@gmail.com',
    phone: '+91 XXXXXXXXXX',
    github: '',
  },
  stats: {
    yearsExperience: 4,
    projectsCount: 5,
    companiesCount: 3,
    expertise: 'Angular Expert',
  },
  seo: {
    metaTitle: 'Darshan Nayak | Software Engineer 2 — Angular & Full-Stack Developer',
    metaDescription:
      'Portfolio of Darshan Nayak — Software Engineer 2 with 4+ years of experience in Angular, React, Vue.js, Node.js and full-stack web development.',
    keywords: [
      'Darshan Nayak', 'Software Engineer', 'Angular Developer', 'Frontend Architect',
      'Full-Stack Engineer', 'React', 'Vue.js', 'TypeScript', 'Node.js', 'Micro Frontend',
      'Mangalore Developer', 'Karnataka',
    ],
  },
  themePreset: 'midnight-blue',
  fontPair: 'modern-sans',
};

const SKILLS_DATA = [
  {
    group: 'Frontend',
    icon: '🎨',
    order: 1,
    skills: [
      { name: 'Angular', proficiency: 95 },
      { name: 'TypeScript', proficiency: 92 },
      { name: 'Vue.js', proficiency: 80 },
      { name: 'React', proficiency: 75 },
      { name: 'HTML5 / CSS3', proficiency: 95 },
      { name: 'SCSS / SASS', proficiency: 90 },
      { name: 'Micro Frontend', proficiency: 85 },
      { name: 'NgRx / Redux / Vuex', proficiency: 82 },
      { name: 'Angular Material', proficiency: 90 },
      { name: 'Bootstrap', proficiency: 88 },
      { name: 'PrimeNG', proficiency: 85 },
      { name: 'Material UI', proficiency: 80 },
      { name: 'Webpack', proficiency: 78 },
      { name: 'Vite', proficiency: 80 },
    ],
  },
  {
    group: 'Backend',
    icon: '⚙️',
    order: 2,
    skills: [
      { name: 'Node.js', proficiency: 82 },
      { name: 'Express.js', proficiency: 80 },
      { name: 'Spring Boot', proficiency: 72 },
      { name: 'Java', proficiency: 70 },
      { name: 'JWT Authentication', proficiency: 85 },
      { name: 'MongoDB', proficiency: 78 },
      { name: 'MySQL', proficiency: 75 },
      { name: 'REST APIs', proficiency: 90 },
      { name: 'Swagger / OpenAPI', proficiency: 80 },
    ],
  },
  {
    group: 'Testing',
    icon: '🧪',
    order: 3,
    skills: [
      { name: 'Jest', proficiency: 82 },
      { name: 'Mocha', proficiency: 78 },
      { name: 'Chai', proficiency: 78 },
      { name: 'Cypress', proficiency: 75 },
    ],
  },
  {
    group: 'Tools',
    icon: '🛠️',
    order: 4,
    skills: [
      { name: 'Git / GitHub', proficiency: 92 },
      { name: 'Tailwind CSS', proficiency: 85 },
      { name: 'Postman', proficiency: 88 },
      { name: 'CI/CD Pipelines', proficiency: 75 },
      { name: 'Docker', proficiency: 70 },
      { name: 'Figma', proficiency: 72 },
    ],
  },
  {
    group: 'Cloud',
    icon: '☁️',
    order: 5,
    skills: [
      { name: 'AWS Concepts', proficiency: 65 },
      { name: 'AWS S3', proficiency: 68 },
      { name: 'AWS EC2', proficiency: 62 },
    ],
  },
];

const EXPERIENCE_DATA = [
  {
    company: 'Terralogic Software Solutions',
    companyUrl: 'https://terralogic.com',
    role: 'Software Engineer 2',
    type: 'full-time',
    startDate: 'Nov 2024',
    endDate: '',
    current: true,
    location: 'Bangalore, India',
    order: 1,
    technologies: ['Angular', 'Micro Frontend', 'TypeScript', 'NgRx', 'Webpack', 'Module Federation'],
    bullets: [
      'Architecting and developing the 1Finity Network Management Tool for Fujitsu using Angular micro-frontend architecture with Module Federation.',
      'Led technical design sessions for scalable component libraries shared across micro-frontends reducing code duplication by 40%.',
      'Implemented real-time network topology visualization with complex data flows using NgRx state management.',
      'Collaborating directly with Fujitsu engineers in an agile environment, participating in sprint planning, code reviews, and retrospectives.',
      'Optimized Angular build pipelines reducing build time by 35% through Webpack configuration tuning.',
    ],
  },
  {
    company: 'TechTree IT Systems',
    companyUrl: '',
    role: 'Associate UI Developer',
    type: 'full-time',
    startDate: 'Sep 2022',
    endDate: 'Aug 2024',
    current: false,
    location: 'Mangalore, India',
    order: 2,
    technologies: ['Angular', 'Vue.js', 'TypeScript', 'Java', 'Spring Boot', 'MongoDB', 'MySQL'],
    bullets: [
      'Developed and maintained 4 client-facing web applications across real estate, CRM, retail, and hospitality sectors.',
      'Built BIND — a comprehensive real estate management platform with property listing, CRM, and lead tracking features.',
      'Developed Reciproci CRM tool enabling end-to-end customer relationship management for enterprise clients.',
      'Created Geekay Gaming Store — a full-stack e-commerce platform for gaming peripherals with live inventory tracking.',
      'Delivered Viya — hotel, golf, and experience booking platform integrating Java Spring Boot backend with Angular frontend.',
      'Mentored 2 junior developers and established code review standards that improved team code quality metrics.',
    ],
  },
  {
    company: 'TechTree IT Systems',
    companyUrl: '',
    role: 'UI Developer Intern',
    type: 'intern',
    startDate: 'Apr 2022',
    endDate: 'Aug 2022',
    current: false,
    location: 'Mangalore, India',
    order: 3,
    technologies: ['Angular', 'TypeScript', 'HTML5', 'SCSS', 'REST APIs'],
    bullets: [
      'Contributed to Angular component development for existing client projects.',
      'Implemented responsive UI designs from Figma mockups achieving pixel-perfect accuracy.',
      'Integrated REST APIs and built reusable form components with reactive forms and validation.',
      'Participated in daily standups and sprint ceremonies, gaining exposure to Agile/Scrum methodology.',
    ],
  },
  {
    company: 'Take it Smart (OPC) Pvt. Ltd.',
    companyUrl: '',
    role: 'Student Intern',
    type: 'intern',
    startDate: 'Aug 2021',
    endDate: 'Sep 2021',
    current: false,
    location: 'Remote',
    order: 4,
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap'],
    bullets: [
      'Developed static web pages and landing pages using HTML5, CSS3, and JavaScript.',
      'Gained foundational knowledge of web development principles and responsive design.',
      'Collaborated with the design team to implement UI prototypes from wireframes.',
    ],
  },
];

const PROJECTS_DATA = [
  {
    title: '1Finity Network Management Tool',
    company: 'Terralogic × Fujitsu',
    date: 'Nov 2024 – Present',
    description:
      'Enterprise-grade network management platform for Fujitsu\'s 1Finity optical networking infrastructure. Built with Angular micro-frontend architecture enabling independent deployment of network topology, device management, and analytics modules.',
    longDescription: `The 1Finity NMT is a mission-critical application managing Fujitsu's global optical networking infrastructure. 
    The system handles real-time network topology visualization, fault management, performance monitoring, and configuration management across thousands of network devices.
    
    Key technical achievements include implementing Module Federation for independent micro-frontend deployment, 
    building a shared design system library used across 6+ micro-frontend apps, 
    and implementing real-time data streams using WebSockets with NgRx effects for state synchronization.`,
    techStack: ['Angular 17', 'Micro Frontend', 'Module Federation', 'NgRx', 'TypeScript', 'Webpack', 'SCSS', 'Jest'],
    imageUrl: '',
    featured: true,
    category: 'Enterprise / Networking',
    order: 1,
    links: { live: '', github: '', demo: '' },
  },
  {
    title: 'BIND — Real Estate Management Platform',
    company: 'TechTree IT Systems',
    date: 'Mar 2023 – Aug 2024',
    description:
      'Comprehensive real estate management CRM featuring property listings, lead tracking, client management, and automated follow-up workflows. Served 200+ real estate agents across multiple branches.',
    longDescription: `BIND is a full-featured real estate management platform serving property agencies across Karnataka. 
    The platform includes a multi-tenant architecture supporting multiple branch offices with role-based access control.
    
    Features include: interactive property search with geolocation filtering, lead pipeline management with automated email follow-ups, 
    document management for property legal documents, commission calculation engine, and comprehensive reporting dashboards.`,
    techStack: ['Angular', 'TypeScript', 'NgRx', 'Node.js', 'MongoDB', 'Angular Material', 'SCSS', 'REST APIs'],
    imageUrl: '',
    featured: true,
    category: 'CRM / Real Estate',
    order: 2,
    links: { live: '', github: '', demo: '' },
  },
  {
    title: 'Reciproci — Enterprise CRM Tool',
    company: 'TechTree IT Systems',
    date: 'Sep 2022 – Feb 2023',
    description:
      'Feature-rich CRM platform enabling businesses to manage customer relationships, track interactions, automate workflows, and generate business intelligence reports. Integrated with WhatsApp Business API.',
    longDescription: `Reciproci is an enterprise CRM built to streamline customer relationship management for medium-to-large businesses.
    
    The platform provides 360-degree customer views, interaction history, multi-channel communication (email, SMS, WhatsApp), 
    pipeline management with drag-and-drop kanban boards, custom field builder for domain-specific data capture, 
    and powerful BI dashboards with exportable reports.`,
    techStack: ['Angular', 'TypeScript', 'Vue.js', 'Java', 'Spring Boot', 'MySQL', 'Bootstrap', 'REST APIs'],
    imageUrl: '',
    featured: false,
    category: 'CRM / SaaS',
    order: 3,
    links: { live: '', github: '', demo: '' },
  },
  {
    title: 'Geekay — Gaming Peripherals Store',
    company: 'TechTree IT Systems',
    date: 'Feb 2023 – Aug 2023',
    description:
      'Full-stack e-commerce platform for gaming peripherals including keyboards, mice, headsets, and accessories. Features live inventory tracking, wishlist, cart, and integrated payment gateway.',
    longDescription: `Geekay is a specialized e-commerce platform for gaming enthusiasts, offering a curated catalog of gaming peripherals with detailed specifications and comparison tools.
    
    Features include: real-time inventory tracking, advanced product filtering (by brand, type, price, specs), 
    product comparison tool, wishlist and cart management, order tracking, admin inventory management dashboard, 
    and integration with popular payment gateways.`,
    techStack: ['Angular', 'TypeScript', 'Node.js', 'MongoDB', 'PrimeNG', 'SCSS', 'JWT', 'REST APIs'],
    imageUrl: '',
    featured: false,
    category: 'E-Commerce',
    order: 4,
    links: { live: '', github: '', demo: '' },
  },
  {
    title: 'Viya — Hotel, Golf & Experience Booking',
    company: 'TechTree IT Systems',
    date: 'Oct 2022 – Jan 2023',
    description:
      'Multi-service booking platform combining hotel reservations, golf course tee time bookings, and curated experience packages. Features real-time availability, dynamic pricing, and integrated payment processing.',
    longDescription: `Viya is a unified booking platform for luxury travel experiences, connecting guests with premium hotels, exclusive golf courses, and unique local experiences.
    
    The platform features: real-time availability calendars with dynamic pricing, multi-service booking (hotel + golf + experience in one checkout), 
    loyalty points system, admin dashboard for property managers, booking analytics, and automated confirmation emails.
    Built with Java Spring Boot backend and Angular frontend for a seamless SPA experience.`,
    techStack: ['Angular', 'TypeScript', 'Java', 'Spring Boot', 'MySQL', 'Angular Material', 'REST APIs', 'JWT'],
    imageUrl: '',
    featured: false,
    category: 'Hospitality / Travel',
    order: 5,
    links: { live: '', github: '', demo: '' },
  },
];

const EDUCATION_DATA = [
  {
    institution: 'Canara Engineering College',
    degree: 'Bachelor of Engineering',
    field: 'Computer Science & Engineering',
    startYear: 2018,
    endYear: 2022,
    grade: 'First Class',
    description: 'Graduated with a strong foundation in data structures, algorithms, software engineering, web development, and database management systems.',
    location: 'Mangalore, Karnataka, India',
    order: 1,
  },
  {
    institution: "Alva's PU College",
    degree: 'Pre-University Certificate',
    field: 'Science (Physics, Chemistry, Mathematics, Biology)',
    startYear: 2016,
    endYear: 2018,
    grade: '',
    description: 'Completed Pre-University education with focus on sciences and mathematics.',
    location: 'Moodbidri, Karnataka, India',
    order: 2,
  },
  {
    institution: 'Ave Maria High School',
    degree: 'SSLC (10th Standard)',
    field: '',
    startYear: 2014,
    endYear: 2016,
    grade: '',
    description: 'Completed secondary school education.',
    location: 'Mangalore, Karnataka, India',
    order: 3,
  },
];

// ── Seed Runner ───────────────────────────────────────────────────────────────

const seed = async () => {
  try {
    console.log('\n🌱 Starting database seed...\n');
    await mongoose.connect(env.MONGODB_URI);
    console.log(`✅ Connected to MongoDB: ${env.MONGODB_URI}\n`);

    // ── Admin ────────────────────────────────────────────────────────────────
    const existingAdmin = await Admin.findOne({ email: ADMIN_DATA.email });
    if (existingAdmin) {
      console.log(`⏭️  Admin already exists: ${ADMIN_DATA.email}`);
    } else {
      await Admin.create(ADMIN_DATA);
      console.log(`✅ Admin created: ${ADMIN_DATA.email}`);
    }

    // ── Profile ──────────────────────────────────────────────────────────────
    await Profile.deleteMany({});
    await Profile.create(PROFILE_DATA);
    console.log('✅ Profile seeded');

    // ── Skills ───────────────────────────────────────────────────────────────
    await Skill.deleteMany({});
    await Skill.insertMany(SKILLS_DATA);
    console.log(`✅ Skills seeded (${SKILLS_DATA.length} groups)`);

    // ── Experience ───────────────────────────────────────────────────────────
    await Experience.deleteMany({});
    await Experience.insertMany(EXPERIENCE_DATA);
    console.log(`✅ Experience seeded (${EXPERIENCE_DATA.length} entries)`);

    // ── Projects ─────────────────────────────────────────────────────────────
    await Project.deleteMany({});
    await Project.insertMany(PROJECTS_DATA);
    console.log(`✅ Projects seeded (${PROJECTS_DATA.length} projects)`);

    // ── Education ────────────────────────────────────────────────────────────
    await Education.deleteMany({});
    await Education.insertMany(EDUCATION_DATA);
    console.log(`✅ Education seeded (${EDUCATION_DATA.length} entries)`);

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Admin Email    : ${ADMIN_DATA.email}`);
    console.log(`   Admin Password : ${env.ADMIN_PASSWORD}`);
    console.log('   ⚠️  Change the password after first login!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed failed:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();
