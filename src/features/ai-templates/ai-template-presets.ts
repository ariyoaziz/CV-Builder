import type { AITemplatePreset } from "./ai-template-types";

export const AI_TEMPLATE_PRESETS: AITemplatePreset[] = [
  {
    id: "general-professional",
    titleId: "Profesional Umum (General Professional)",
    titleEn: "General Professional",
    descriptionId:
      "Cocok untuk berbagai peran dan industri. Menekankan kejelasan tugas, pencapaian kerja, dan format terstruktur yang ramah ATS.",
    descriptionEn:
      "Suitable for all professional roles across industries. Emphasizes structured impact, responsibilities, and clean ATS formatting.",
    suitableForId: ["Semua Industri", "Mid-level & Senior", "Peran Korporat & Startup"],
    suitableForEn: ["All Industries", "Mid & Senior Roles", "Corporate & Startups"],
    whenToUseId:
      "Gunakan saat Anda ingin merapikan CV untuk berbagai kebutuhan lowongan umum tanpa spesialisasi sempit.",
    whenToUseEn:
      "Use when you want a balanced, polished CV suitable for broad job applications.",
    tipsId: [
      "Gunakan kata kerja aksi di awal setiap bullet point pengalaman.",
      "Tampilkan konteks tanggung jawab dan hasil kerja nyata.",
      "Kelompokkan keahlian ke dalam kategori yang mudah dipindai HR.",
    ],
    tipsEn: [
      "Begin each bullet point with strong action verbs.",
      "Highlight clear responsibilities and tangible outcomes.",
      "Group skills into scannable categories.",
    ],
    suggestedFocusId: "Keseimbangan antara pengalaman kerja, ringkasan profil, dan keahlian relevan.",
    suggestedFocusEn: "Balance between work history, professional summary, and relevant competencies.",
  },
  {
    id: "fresh-graduate",
    titleId: "Fresh Graduate & Mahasiswa",
    titleEn: "Fresh Graduate & Student",
    descriptionId:
      "Dirancang untuk menonjolkan prestasi akademik, pengalaman magang, organisasi, kepanitiaan, dan proyek studi.",
    descriptionEn:
      "Optimized for recent graduates and students highlighting academic achievements, internships, campus leadership, and coursework projects.",
    suitableForId: ["Lulusan Baru", "Mahasiswa Tingkat Akhir", "Magang & Management Trainee"],
    suitableForEn: ["Recent Graduates", "Final-year Students", "Internships & MT Programs"],
    whenToUseId:
      "Gunakan jika Anda belum memiliki pengalaman kerja purnawaktu bertahun-tahun namun memiliki proyek atau aktivitas kampus yang kuat.",
    whenToUseEn:
      "Use when you have limited full-time work experience but strong coursework, projects, or leadership roles.",
    tipsId: [
      "Jelaskan proyek akhir atau studi kasus yang relevan dengan posisi yang dilamar.",
      "Sertakan pengalaman magang, organisasi, atau program volunteer.",
      "Tuliskan IPK / nilai akhir jika merupakan nilai tambah (misalnya >= 3.50).",
    ],
    tipsEn: [
      "Detail capstone projects or relevant coursework case studies.",
      "Include internships, campus organizations, and volunteer work.",
      "Include GPA or academic honors if they represent a strong asset.",
    ],
    suggestedFocusId: "Pendidikan, Proyek Kuliah, Organisasi, dan Keahlian Dasar yang Relevan.",
    suggestedFocusEn: "Education, Academic Projects, Leadership, and Core Transferable Skills.",
  },
  {
    id: "career-switcher",
    titleId: "Career Switcher / Pindah Bidang",
    titleEn: "Career Switcher",
    descriptionId:
      "Fokus pada transferable skills, sertifikasi terbaru, portofolio proyek mandiri, dan relevansi pengalaman lintas bidang.",
    descriptionEn:
      "Focuses on transferable skills, recent certifications, independent portfolio projects, and bridging cross-industry expertise.",
    suitableForId: ["Pindah Industri", "Pindah Jalur Karir", "Re-skilling / Upskilling"],
    suitableForEn: ["Industry Pivot", "Role Change", "Upskilled Professionals"],
    whenToUseId:
      "Gunakan jika Anda sedang bertransisi dari satu bidang ke bidang baru dan ingin menghubungkan keahlian lama ke peran baru.",
    whenToUseEn:
      "Use when transitioning between industries or functional roles to connect prior skills to target roles.",
    tipsId: [
      "Tuliskan Ringkasan Profil yang menjelaskan motivasi dan relevansi transisi karir Anda.",
      "Tonjolkan transferable skills seperti komunikasi, manajemen proyek, problem solving, dan analitik.",
      "Sertakan kursus, sertifikasi, atau proyek mandiri yang membuktikan kesiapan di bidang baru.",
    ],
    tipsEn: [
      "Craft a compelling summary bridging past experience with target domain value.",
      "Emphasize transferable skills like project management, analytical thinking, and stakeholder communication.",
      "Highlight recent bootcamps, courses, and independent projects demonstrating hands-on capability.",
    ],
    suggestedFocusId: "Transferable Skills, Ringkasan Transisi, Sertifikasi Terbaru, dan Proyek Portofolio.",
    suggestedFocusEn: "Transferable Skills, Transition Narrative, Recent Credentials, and Portfolio Projects.",
  },
  {
    id: "creative-design",
    titleId: "Kreatif & Desain (Creative / Design)",
    titleEn: "Creative & Design",
    descriptionId:
      "Disesuaikan untuk desainer produk, UI/UX, grafis, multimedia, dan penulis kreatif dengan tautan portofolio yang rapi.",
    descriptionEn:
      "Tailored for product designers, UI/UX, graphic designers, multimedia artists, and content creators with clean portfolio linking.",
    suitableForId: ["UI/UX & Product Design", "Graphic & Brand Design", "Creative & Content"],
    suitableForEn: ["UI/UX & Product Design", "Graphic & Brand Design", "Creative & Content"],
    whenToUseId:
      "Gunakan untuk peran kreatif yang membutuhkan penjabaran proses desain, tools keahlian, dan link portofolio resmi.",
    whenToUseEn:
      "Use for creative roles requiring clear design process articulation, tool mastery, and portfolio links.",
    tipsId: [
      "Pastikan tautan portofolio (misal Behance, Dribbble, website) dimasukkan pada bagian informasi pribadi atau proyek.",
      "Jelaskan kontribusi Anda pada setiap proyek (misal: wireframing, user research, design system).",
      "Sebutkan software dan tools desain spesifik (Figma, Adobe CC, Blender, dll).",
    ],
    tipsEn: [
      "Ensure clean portfolio URLs are embedded in personal info or project links.",
      "Detail your specific contribution per project (e.g. user research, prototyping, design systems).",
      "List specific industry software and design tooling competencies.",
    ],
    suggestedFocusId: "Proyek Desain, Tautan Portofolio, Tools Kreatif, dan Metrik Dampak Pengguna.",
    suggestedFocusEn: "Design Projects, Portfolio Links, Creative Tooling, and User Impact Metrics.",
  },
  {
    id: "business-marketing",
    titleId: "Bisnis & Pemasaran (Business / Marketing)",
    titleEn: "Business & Marketing",
    descriptionId:
      "Menonjolkan pertumbuhan bisnis, pendapatan, akuisisi pengguna, kampanye pemasaran digital, dan strategi kemitraan.",
    descriptionEn:
      "Emphasizes revenue growth, conversion rates, customer acquisition, digital campaigns, and strategic partnerships.",
    suitableForId: ["Marketing & Brand", "Business Development", "Sales & Operations"],
    suitableForEn: ["Marketing & Growth", "Business Development", "Sales & Strategy"],
    whenToUseId:
      "Gunakan untuk posisi pemasaran, penjualan, manajemen produk, atau pengembangan bisnis berbasis target.",
    whenToUseEn:
      "Use for performance-driven business, marketing, revenue, and growth-oriented opportunities.",
    tipsId: [
      "Gunakan data atau metrik pencapaian yang nyata dari pengalaman Anda (misal: persentase pertumbuhan, efisiensi anggaran).",
      "Sebutkan channel pemasaran dan tools analitik yang dikuasai (Google Analytics, Meta Ads, HubSpot, dll).",
      "Jelaskan skala kampanye atau kemitraan bisnis yang Anda kelola.",
    ],
    tipsEn: [
      "Include factual performance indicators from your actual achievements (e.g. ROI, conversion lift).",
      "Specify marketing channels and marketing tech stack (SEO, SEM, CRM, Analytics).",
      "Describe scale of managed budgets, accounts, or cross-functional campaigns.",
    ],
    suggestedFocusId: "Pertumbuhan Bisnis, Kampanye Pemasaran, Metrik Pencapaian Nyata, dan Strategi Pasar.",
    suggestedFocusEn: "Business Growth, Marketing Campaigns, Verifiable Metrics, and Go-to-Market Strategy.",
  },
  {
    id: "technology",
    titleId: "Teknologi & Rekayasa Perangkat Lunak",
    titleEn: "Technology & Software Engineering",
    descriptionId:
      "Dirancang untuk software engineers, data engineers, DevOps, QA, dan IT specialists dengan penataan tech stack yang bersih.",
    descriptionEn:
      "Engineered for software developers, data scientists, cloud architects, QA, and IT specialists with clean tech stack breakdown.",
    suitableForId: ["Software Developers", "Data & AI Specialists", "DevOps & Infrastructure"],
    suitableForEn: ["Software Engineers", "Data & Cloud Specialists", "QA & DevOps Engineers"],
    whenToUseId:
      "Gunakan untuk lamaran teknis yang membutuhkan penjelasan arsitektur sistem, bahasa pemrograman, dan proyek open source / komersial.",
    whenToUseEn:
      "Use for technical engineering roles requiring clean architecture articulation and tech stack scannability.",
    tipsId: [
      "Kelompokkan tech stack ke dalam kategori: Bahasa Pemrograman, Framework, Database, Cloud & Tools.",
      "Sebutkan dampak teknis (misal: pengurangan latensi, peningkatan throughput, otomatisasi CI/CD).",
      "Sertakan link GitHub atau repositori open source jika relevan.",
    ],
    tipsEn: [
      "Categorize tech stack clearly: Languages, Frameworks, Databases, Cloud & DevOps.",
      "Highlight technical optimizations (e.g. latency reduction, test coverage, scalability).",
      "Include GitHub profile or repository links where appropriate.",
    ],
    suggestedFocusId: "Tech Stack Terstruktur, Arsitektur Sistem, Proyek Open Source/Komersial, dan Efisiensi Teknis.",
    suggestedFocusEn: "Categorized Tech Stack, System Architecture, Code Impact, and Engineering Reliability.",
  },
  {
    id: "academic-research",
    titleId: "Akademik & Riset (Academic / Research)",
    titleEn: "Academic & Research",
    descriptionId:
      "Disesuaikan untuk akademisi, peneliti, dosen, dan pelamar beasiswa dengan fokus publikasi ilmiah, konferensi, dan metodologi riset.",
    descriptionEn:
      "Optimized for researchers, scholars, educators, and fellowship applicants with publication records and research methodologies.",
    suitableForId: ["Peneliti & Dosen", "Pelamar Beasiswa / S2 / S3", "R&D & Analis Kebijakan"],
    suitableForEn: ["Researchers & Faculty", "Scholarship & Fellowship Applicants", "R&D Scientists"],
    whenToUseId:
      "Gunakan untuk lamaran ke universitas, institusi riset, program pascasarjana, atau lembaga donor beasiswa.",
    whenToUseEn:
      "Use for university faculty applications, research institutes, graduate fellowships, or grants.",
    tipsId: [
      "Manfaatkan section Publikasi Ilmiah untuk menampilkan judul paper, jurnal/konferensi, dan tahun.",
      "Jelaskan hibah penelitian, penghargaan akademik, atau program residensi riset yang pernah didapat.",
      "Sertakan riwayat mengajar atau bimbingan akademik jika relevan.",
    ],
    tipsEn: [
      "Utilize Publications section to list peer-reviewed papers, conferences, and journal DOIs.",
      "Detail research grants, academic fellowships, and laboratory leadership.",
      "Highlight teaching experience, student mentorship, and thesis supervision.",
    ],
    suggestedFocusId: "Publikasi Ilmiah, Hibah Riset, Riwayat Pendidikan Tinggi, dan Metodologi Akademik.",
    suggestedFocusEn: "Peer-reviewed Publications, Research Grants, Higher Education, and Scientific Rigor.",
  },
];
