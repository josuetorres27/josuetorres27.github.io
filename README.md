# Josue Torres Sibaja — Software Engineering Portfolio

[![Live Portfolio](https://img.shields.io/badge/Live_Site-josuetorres.tech-3b82f6?style=flat-square&logo=google-chrome&logoColor=white)](https://josuetorres.tech/)
[![CI Test Suite](https://github.com/josuetorres27/josuetorres27.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/josuetorres27/josuetorres27.github.io/actions/workflows/ci.yml)
[![Automated Tests](https://img.shields.io/badge/Tests-314%20Passing-success?style=flat-square&logo=python&logoColor=white)](#automated-testing--quality-assurance)
[![Production Pipeline](https://img.shields.io/badge/Deployed%20with-CI%2FCD%20Pipeline-22c55e?style=flat-square&logo=githubactions&logoColor=white)](https://josuetorres.tech/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38bdf8?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Bilingual](https://img.shields.io/badge/i18n-English%20%7C%20Espa%C3%B1ol-8b5cf6?style=flat-square)](#portfolio-key-features)
[![Web Audio API](https://img.shields.io/badge/Web_Audio-8--Bit_Synth-f59e0b?style=flat-square)](#portfolio-key-features)

Welcome to the official repository for my personal software engineering portfolio. This website showcases my academic background, featured software engineering projects, production experience in Information Technology infrastructure & web administration, applied AI workflows, and personal interests — wrapped in a custom retro gaming and terminal aesthetic.

**Live Website:** [https://josuetorres.tech](https://josuetorres.tech)

---

## About Me

I am a **Computer Science Graduating Senior** (Software Engineering emphasis) at the **University of Costa Rica (UCR)** (all coursework completed Dec 2026; degree expected April 2027). I build scalable, full-stack, systems-level, and distributed software using modern engineering practices and AI agentic workflows, backed by solid foundations in data structures, algorithms, object-oriented design, and practical university infrastructure and software engineering experience.

- **Education:** B.Sc. in Computer Science (Software Engineering Emphasis) — University of Costa Rica (UCR) *(Mar 2023 – Dec 2026 · Coursework Completed · Degree Expected April 2027)*
- **Languages:** Spanish (Native), English (CEFR B2–C1 Bilingual Working Proficiency — Universidad Nacional, 2019 – 2021 · 13 Levels / 520 Hours)
- **Current Role:** Information Technology Support Assistant at University of Costa Rica (Orientation Office) *(Aug 2026 – Present · Active Contract)*
- **Availability:** Full-Time Entry-Level & Junior Software Engineering Roles *(Available Immediately)*

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

### [LASCE — Institutional Scientific Web Platform](https://lasce.ucr.ac.cr) *(Institutional Project · Concludes Dec 2026)*
Full-stack institutional and scientific-data platform developed for the **Solar Astrophysics and Space Weather Laboratory (LASCE)** at the Universidad de Costa Rica.
- **Live Platform:** [https://lasce.ucr.ac.cr](https://lasce.ucr.ac.cr)
- **Repository:** [LasceUCR/lasce](https://github.com/LasceUCR/lasce)
- **Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Prisma ORM, PostgreSQL, Redis, BullMQ, Python 3.13 Worker, MinIO, Docker, Playwright E2E, Vitest.
- **Contributions:** Complete CMS suite for scientific news and the ROSAC radio observatory (optimistic concurrency control, Prisma transactions, MinIO asset pipelines), accessible WCAG UI components, and automated E2E testing suites.

### [CS Interactive Workshop](https://cs-interactive-workshop.web.app/) *(Sep 2024 – Present)*
Interactive web workshop for Computer Science students at the Universidad de Costa Rica, built on visual simulations backed by real C and C++ engines.
- **Live App:** [https://cs-interactive-workshop.web.app](https://cs-interactive-workshop.web.app/)
- **Repository:** [josuetorres27/cs-interactive-workshop](https://github.com/josuetorres27/cs-interactive-workshop)
- **Stack:** C11, C++17, POSIX Threads, OpenMP, BSD Sockets (TCP/IP), JavaScript, Firebase (Hosting, Auth, Firestore), GitHub Actions.
- **Highlights:** Stations on algorithms, data structures, concurrency, networking, interview patterns, and SQL; a 2D heat diffusion solver in serial, pthreads, and OpenMP versions with bit-for-bit identical results; a multi-threaded TCP server; and a CI pipeline running more than 880 automated tests before every deployment.

### [PAdES-LTA Renewer](https://github.com/josuetorres27/pades-lta-renewer) *(Oct 2026 – Present · UCR)*
Research project for **CI-0140 Software Quality**: an engine and web service that renews timestamps on digitally signed PDF documents for long-term preservation (PAdES-B-LTA / ETSI EN 319 142), in line with Costa Rica's Law 8454.
- **Repository:** [josuetorres27/pades-lta-renewer](https://github.com/josuetorres27/pades-lta-renewer)
- **Stack:** Python, Flask, cryptography, asn1crypto, pypdf, RFC 3161, X.509, OCSP, CRL, pytest.
- **Highlights:** RFC 3161 client for the SINPE Time Stamping Authority (BCCR), X.509 chain reconstruction up to the national root CA with OCSP/CRL revocation checks, and incremental PDF updates that add `/DSS` evidence and `/DocTimeStamp` seals without invalidating existing signatures.
- **Co-author:** Gabriel Serrano Rojas

### ¿Quién controla nuestra atención? *(Ethical Vodcast)*
Audiovisual ethical investigation analyzing algorithmic recommendation engines, the attention economy, and the professional responsibilities of computing engineers.
- **Episodes:** [Episodio 1 (YouTube)](https://youtu.be/ltSKzyDhLzY) · [Episodio 2 — Detrás de Cámaras (YouTube)](https://youtu.be/MKMLW2HJ6zo)
- **Co-creators:** [Gabriel Serrano](https://www.linkedin.com/in/gabrielserranor/) & [Rolando Villavicencio González](https://www.linkedin.com/in/rolando-villavicencio-gonzalez/)
- **Production:** Multi-camera setup, scriptwriting, professional sound engineering, and post-production editing.

### [Virtual Microscope Administration Panel](https://github.com/RolandoVillavicencio013/biological-microscope-administration-panel) *(UCR)*
Desktop administration platform that digitizes microscopy workflows and manages biological specimen collections.
- **Repository:** [RolandoVillavicencio013/biological-microscope-administration-panel](https://github.com/RolandoVillavicencio013/biological-microscope-administration-panel)
- **Stack:** C#, ASP.NET Core, .NET, PostgreSQL, Desktop Architecture, Visual Studio.
- **Highlights:** Hierarchical data organization (Groups, Boxes, Slides), high-fidelity microscopy imaging, and offline-capable workstation data persistence.

### ThemePark UCR — Virtual University Simulation *(UCR)*
Virtual campus simulation built in Unity with a decoupled backend architecture.
- **Stack:** C#, ASP.NET Core, RESTful APIs, SQL Server, Unity Integration, Scrum.
- **Highlights:** Decoupled REST services for real-time interaction with virtual campus buildings, facilities, and interactive learning objects.

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

## Automated Testing & Quality Assurance

To ensure rock-solid production stability and guarantee that no component or translation breaks silently, this repository includes an automated test suite of **314 tests** executed on Python 3.12+ and integrated into GitHub Actions CI:

- **Internationalization Suite (`tests/test_i18n.py`):** 284 tests validating symmetry across all 275 translation keys between English and Spanish, strict parity, array lengths, absence of encoding mojibake, and synchronization with all `data-i18n` DOM bindings.
- **DOM & Semantic Integrity (`tests/test_dom_integrity.py`):** 14 tests verifying HTML5 compliance, OpenGraph metadata, Twitter cards, Schema.org JSON-LD graphs, absence of duplicate element IDs, and presence of all interactive target IDs.
- **Assets Integrity (`tests/test_assets_integrity.py`):** 10 tests verifying that every image, sprite sheet, icon, PDF document, and modular script referenced across the codebase physically exists on disk with non-zero size.
- **JavaScript Syntax & Scope Hygiene (`tests/test_js_syntax.py`):** 6 tests performing lexical scope tracking to prevent variable redeclaration collisions (e.g. duplicate `const`/`let`), delimiter balancing (`{}`, `[]`, `()`), and absence of debugger leftovers.

### Running Tests Locally

```bash
python tests/run_tests.py
```

---

## Repository Structure

```text
josuetorres27.github.io/
├── .github/
│   └── workflows/
│       ├── ci.yml                                  # GitHub Actions automated test runner
│       └── deploy.yml                              # Coolify production deployment pipeline
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
│   ├── modules/
│   │   ├── audio.js                                # Native Web Audio API 8-bit retro sound synthesizer
│   │   ├── theme.js                                # Dark/Light mode engine & icon synchronization
│   │   ├── ui.js                                   # Dropdowns, mobile menu & clipboard manager
│   │   ├── i18n.js                                 # Bilingual translation engine & hero typewriter
│   │   ├── lightbox.js                             # Touch carousel & full-screen photo viewer
│   │   └── adventure.js                            # 8-bit companion, rail map & scrollytelling
│   ├── translations.js                             # Bilingual (EN/ES) dictionaries (275 keys)
│   └── main.js                                     # Application orchestrator (window.Portfolio)
├── tests/
│   ├── test_i18n.py                                # Symmetry, encoding, non-emptiness & DOM checks
│   ├── test_dom_integrity.py                       # DOCTYPE, OpenGraph, JSON-LD, IDs & A11y
│   ├── test_assets_integrity.py                    # Images, sprites, icons, documents & scripts
│   ├── test_js_syntax.py                           # Balanced tokens, lexical scopes & syntax
│   └── run_tests.py                                # Master CLI runner with formatted report
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
