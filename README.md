# Josue Torres Sibaja — Software Engineering Portfolio

[![Live Portfolio](https://img.shields.io/badge/Live_Site-josuetorres.tech-3b82f6?style=flat-square&logo=google-chrome&logoColor=white)](https://josuetorres.tech/)
[![Production Pipeline](https://img.shields.io/badge/Deployed%20with-CI%2FCD%20Pipeline-22c55e?style=flat-square&logo=githubactions&logoColor=white)](https://josuetorres.tech/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38bdf8?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Bilingual](https://img.shields.io/badge/i18n-English%20%7C%20Espa%C3%B1ol-8b5cf6?style=flat-square)](#portfolio-key-features)
[![Web Audio API](https://img.shields.io/badge/Web_Audio-8--Bit_Synth-f59e0b?style=flat-square)](#portfolio-key-features)

Welcome to the official repository for my personal software engineering portfolio. This website showcases my academic background, featured software engineering projects, production experience in IT infrastructure & web administration, applied AI workflows, and personal interests — wrapped in a custom retro gaming and terminal aesthetic.

**Live Website:** [https://josuetorres.tech](https://josuetorres.tech)

---

## About Me

I am a final-semester Computer Science and Software Engineering student at the **Universidad de Costa Rica (UCR)**. I have a passion for building high-performance software, scalable systems, and clean architectural patterns. My background combines rigorous theoretical foundations (data structures, algorithms, object-oriented design, distributed systems) with practical industry and university engineering experience.

- **Education:** B.Sc. in Computer Science (Software Engineering Emphasis) — Universidad de Costa Rica (UCR) *(Mar 2023 – Dec 2026 · Final Graduation Stage)*
- **Languages:** Spanish (Native), English (CEFR B2–C1 Bilingual Working Proficiency — Universidad Nacional, 2019 – 2021 · 13 Levels / 520 Hours)
- **Current Role:** IT Support Assistant at Universidad de Costa Rica (Oficina de Orientación) *(Aug 2026 – Present · Active Contract)*
- **Target Role:** Junior Software Engineer / Software Engineering Intern

---

## Technical Stack & Skills

| Category | Technologies & Tools |
| :--- | :--- |
| **Languages** | Python, C++, TypeScript, JavaScript (ES6+), C#, Java, SQL, HTML5, CSS3 |
| **Frameworks & Libraries** | Next.js 16, React 19, ASP.NET Core, Node.js, Tailwind CSS |
| **Databases** | Microsoft SQL Server, PostgreSQL |
| **Developer Tools & Infrastructure** | Git, GitHub Actions (CI/CD), Linux, Windows, Docker, Visual Studio, VS Code |
| **Applied AI & Agentic Workflows** | Multi-Agent Systems, Autonomous Coding Agents, Google Antigravity, Claude Code, GitHub Copilot, Tool & Function Calling, Prompt & Context Engineering |

---

## Featured Projects

### [LASCE — Institutional Scientific Web Platform](https://lasce.ucr.ac.cr) *(Active Development)*
Full-stack institutional and scientific-data platform developed for the **Solar Astrophysics and Space Weather Laboratory (LASCE)** at the Universidad de Costa Rica.
- **Live Platform:** [https://lasce.ucr.ac.cr](https://lasce.ucr.ac.cr)
- **Repository:** [LasceUCR/lasce](https://github.com/LasceUCR/lasce)
- **Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Prisma ORM, PostgreSQL, Redis, BullMQ, Python 3.13 Worker, MinIO, Docker, Playwright E2E, Vitest.
- **Contributions:** Complete CMS suite for scientific news and the ROSAC radio observatory (optimistic concurrency control, Prisma transactions, MinIO asset pipelines), accessible WCAG UI components, and automated E2E testing suites.

### [Virtual Microscope Administration Panel](https://github.com/RolandoVillavicencio013/biological-microscope-administration-panel) *(UCR)*
Desktop administration platform that digitizes microscopy workflows and manages biological specimen collections.
- **Repository:** [RolandoVillavicencio013/biological-microscope-administration-panel](https://github.com/RolandoVillavicencio013/biological-microscope-administration-panel)
- **Stack:** C#, ASP.NET Core, .NET, PostgreSQL, Desktop Architecture, Visual Studio.
- **Highlights:** Hierarchical data organization (Groups, Boxes, Slides), high-fidelity microscopy imaging, and offline-capable workstation data persistence.

### ThemePark UCR — Virtual University Simulation *(UCR)*
Virtual campus simulation built in Unity with a decoupled backend architecture.
- **Stack:** C#, ASP.NET Core, RESTful APIs, SQL Server, Unity Integration, Scrum.
- **Highlights:** Decoupled REST services for real-time interaction with virtual campus buildings, facilities, and interactive learning objects.

### Distributed ASCII Art System *(UCR)*
Distributed client-server network architecture for managing and rendering ASCII art figures across nodes.
- **Stack:** C++, Linux Sockets (TCP/IP), HTTP Protocol, Inter-Process Communication (IPC), Custom File System.
- **Highlights:** Concurrent connection handling, network protocol design, and multi-node communication in a Linux environment.

### ¿Quién controla nuestra atención? *(Ethical Vodcast)*
Audiovisual ethical investigation analyzing algorithmic recommendation engines, the attention economy, and the professional responsibilities of computing engineers.
- **Episodes:** [Episodio 1 (YouTube)](https://youtu.be/ltSKzyDhLzY) · [Episodio 2 — Detrás de Cámaras (YouTube)](https://youtu.be/MKMLW2HJ6zo)
- **Co-creators:** [Gabriel Serrano](https://www.linkedin.com/in/gabrielserranor/) & [Rolando Villavicencio González](https://www.linkedin.com/in/rolando-villavicencio-gonzalez/)
- **Production:** Multi-camera setup, scriptwriting, professional sound engineering, and post-production editing.

---

## Portfolio Key Features

- **Retro Gaming Aesthetic & Interactive Adventure Mode:** Custom stepped pixel-art frames, arcade CRT/terminal window headers, quest tags, and an interactive pixel companion with animated checkpoints, responsive dialogue engine, and smooth section navigation.
- **Procedural 8-Bit Audio Synthesis:** Real-time retro sound effects (blip, coin, jump, level-up, exit) synthesized on-the-fly using native **Web Audio API** oscillators — zero external audio files or dependencies.
- **Zero-Build Static Performance:** Built with clean HTML5, Tailwind CSS, and vanilla ES6+ JavaScript. Blazing-fast load times with zero framework bundle overhead.
- **Dual-Language Architecture (EN / ES):** Complete client-side internationalization system (`I18N`) with automatic locale detection, persistent language preference, and URL parameter support.
- **Adaptive Theme Engine:** Seamless Dark and Light theme switching with custom retro color palettes, system preference detection, and smooth color transitions.
- **Cross-Platform Responsive & Accessible:** Optimized for devices ranging from mobile (360px – 414px) and tablet (768px – 834px) to widescreen desktop, adhering to semantic HTML, keyboard navigation, and WCAG contrast guidelines.
- **Interactive Galleries & Lightbox:** Custom carousels and full-screen image inspection modal with geolocation metadata and photography details.

---

## Repository Structure

```text
josuetorres27.github.io/
├── css/
│   └── styles.css                                  # Custom retro, CRT scanlines & pixel styling
├── docs/
│   ├── Josue_Torres_Resume.pdf                     # English Resume (PDF)
│   ├── Josue_Torres_CV.pdf                         # Spanish Curriculum Vitae (PDF)
│   └── Josue_Torres_English_Certificate_UNA.pdf    # UNA Conversational English Certificate (PDF)
├── img/
│   ├── portfolio.jpeg                              # Professional profile photograph
│   ├── icons/                                      # Custom retro pixel-art icon suite
│   ├── character-sprites/                          # Pixel companion animation sprite sheets
│   ├── experience/                                 # Workplace & IT operations photographic evidence
│   ├── handicrafts/                                # Foamy clay sculpting & TCU workshop creations
│   └── photography/                                # Costa Rica landscape & nature gallery
├── js/
│   ├── main.js                                     # Interactive companion, audio synth & observers
│   └── translations.js                             # Bilingual (EN/ES) internationalization data
├── index.html                                      # Semantic, accessible HTML markup structure
└── README.md                                       # Repository documentation & presentation
```

---

## Curriculum Vitae, Resume & Certifications

You can view or download my latest resumes and official certifications directly from the repository:
- [English Resume (PDF)](./docs/Josue_Torres_Resume.pdf)
- [Curriculum Vitae en Español (PDF)](./docs/Josue_Torres_CV.pdf)
- [UNA Conversational English Certificate (PDF)](./docs/Josue_Torres_English_Certificate_UNA.pdf)

---

## Contact & Connect

- **LinkedIn:** [linkedin.com/in/josue-torres-sibaja](https://www.linkedin.com/in/josue-torres-sibaja/)
- **GitHub:** [github.com/josuetorres27](https://github.com/josuetorres27)
- **Email:** [dev.josue.torres@gmail.com](mailto:dev.josue.torres@gmail.com)

---

<div align="center">
  <sub>Designed & Developed by Josue Torres Sibaja · Hosted on josuetorres.tech</sub>
</div>
