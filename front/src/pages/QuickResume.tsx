import { useLang } from "../context/LangContext";

const A = "#4488ff";

const S = {
    page: {
        background: "#0d0d1a", color: "#ddd", minHeight: "100vh",
        padding: "32px 36px", fontFamily: "sans-serif", boxSizing: "border-box" as const,
    },
    header: { marginBottom: 24 },
    name: { color: "#fff", fontSize: 26, fontWeight: 700, margin: 0, lineHeight: 1.2 },
    role: { color: A, fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" as const, marginTop: 4 },
    contacts: { display: "flex", gap: 20, marginTop: 10, flexWrap: "wrap" as const },
    contact: { color: "#888", fontSize: 12, textDecoration: "none" },
    hr: { border: "none", borderTop: "1px solid rgba(255,255,255,0.07)", margin: "18px 0" },
    h2: {
        color: A, fontSize: 11, fontWeight: 700, letterSpacing: 2,
        textTransform: "uppercase" as const, margin: "0 0 10px 0",
    },
    row: { display: "flex", gap: 12, marginBottom: 10, alignItems: "baseline" as const },
    date: { color: "#555", fontSize: 11, minWidth: 100, flexShrink: 0 },
    place: { color: "#fff", fontSize: 13, fontWeight: 600 },
    desc: { color: "#888", fontSize: 12, marginTop: 2, lineHeight: 1.5 },
    tag: {
        display: "inline-block", background: "rgba(68,136,255,0.1)", color: "#6aafff",
        border: "1px solid rgba(68,136,255,0.25)", borderRadius: 4,
        padding: "2px 8px", fontSize: 11, marginRight: 5, marginBottom: 5,
    },
    tagGroup: { marginBottom: 10 },
    tagLabel: { color: "#555", fontSize: 11, marginBottom: 4 },
    projRow: { display: "flex", gap: 8, marginBottom: 6, alignItems: "baseline" as const },
    projName: { color: "#ddd", fontSize: 13, fontWeight: 600, minWidth: 130, flexShrink: 0 },
    projDesc: { color: "#666", fontSize: 12 },
    langRow: { display: "flex", gap: 8, marginBottom: 5, alignItems: "center" as const },
    langName: { color: "#ddd", fontSize: 12, fontWeight: 600, minWidth: 90 },
    langLvl: { color: "#555", fontSize: 11 },
    hint: { color: "#444", fontSize: 11, marginTop: 24 },
};

const T = {
    en: {
        role: "Engineering Student · Developer",
        school: "Polytech Paris-Saclay · Engineering degree · 2026",
        toeic: "TOEIC 980 / 990",
        expTitle: "Experience",
        exp: [
            {
                date: "May – Sep 2025",
                place: "VISC — Norrköping, Sweden",
                desc: "4-month internship. Backend development for a research project combining real-time AI and interactive data visualisation. API integration, data structuring, frontend.",
            },
            {
                date: "2023",
                place: "Pyralis — Fire Safety",
                desc: "1-month internship. Non-compliance identification against standards, technical plan correction with AutoCAD.",
            },
        ],
        eduTitle: "Education",
        edu: [
            { date: "2021 – 2026", place: "Polytech Paris-Saclay", desc: "Engineering degree — Computer Science & AI track" },
        ],
        skillsTitle: "Skills",
        skills: [
            { label: "Languages", tags: ["Python", "TypeScript", "Go", "C / C++", "SQL", "Java"] },
            { label: "Web / Infra", tags: ["React", "FastAPI", "Three.js", "Docker", "Nginx", "PostgreSQL"] },
            { label: "AI / ML", tags: ["PyTorch", "scikit-learn", "XLM-RoBERTa", "NLP", "Zero-shot", "FastText"] },
            { label: "Security", tags: ["Nmap", "ffuf", "SSTI / RCE", "CTF", "Kali Linux", "GPG"] },
        ],
        projTitle: "Projects",
        proj: [
            { name: "Multilingual NLU", desc: "Zero-shot intent detection & slot filling — English → French, no French training data. GRU / Transformer / XLM-RoBERTa." },
            { name: "Cyber Audit", desc: "Full pentest on HackTheBox (SSTI → credential dump → pickle RCE → root via GPG brute-force)." },
            { name: "3D Portfolio", desc: "Interactive Three.js portfolio with mini-game, i18n, containerised backend (FastAPI + PostgreSQL + Nginx)." },
            { name: "3D Space Game", desc: "Real-time multiplayer game — Three.js / WebGL, Go backend, WebSockets + Protobuf, Docker Compose." },
            { name: "Dominion (C++)", desc: "Full recreation of the card game with OpenGL UI built from scratch, MiniAudio, custom components." },
            { name: "Eco App", desc: "Ecological impact tracking application." },
        ],
        langTitle: "Languages",
        langs: [
            { fi: "fr", name: "French", level: "Native" },
            { fi: "gb", name: "English", level: "Bilingual · TOEIC 980" },
            { fi: "jp", name: "Japanese", level: "A2" },
            { fi: "de", name: "German", level: "A2" },
        ],
        contacts: [
            { label: "matys@grangaud.org", href: "mailto:matys@grangaud.org" },
            { label: "linkedin.com/in/matys-grangaud", href: "https://linkedin.com/in/matys-grangaud-050718386" },
            { label: "github.com/Zephiel42", href: "https://github.com/Zephiel42" },
        ],
        hint: "← Close panel to return to the 3D scene.",
    },
    fr: {
        role: "Étudiant ingénieur · Développeur",
        school: "Polytech Paris-Saclay · Diplôme d'ingénieur · 2026",
        toeic: "TOEIC 980 / 990",
        expTitle: "Expériences",
        exp: [
            {
                date: "Mai – Sep 2025",
                place: "VISC — Norrköping, Suède",
                desc: "Stage de 4 mois. Développement backend pour un projet de recherche couplant IA temps réel et visualisation interactive de données. Intégration API, structuration de données, frontend.",
            },
            {
                date: "2023",
                place: "Pyralis — Sécurité incendie",
                desc: "Stage d'un mois. Identification de non-conformités aux normes, correction de plans techniques avec AutoCAD.",
            },
        ],
        eduTitle: "Formation",
        edu: [
            { date: "2021 – 2026", place: "Polytech Paris-Saclay", desc: "Diplôme d'ingénieur — Informatique & IA" },
        ],
        skillsTitle: "Compétences",
        skills: [
            { label: "Langages", tags: ["Python", "TypeScript", "Go", "C / C++", "SQL", "Java"] },
            { label: "Web / Infra", tags: ["React", "FastAPI", "Three.js", "Docker", "Nginx", "PostgreSQL"] },
            { label: "IA / ML", tags: ["PyTorch", "scikit-learn", "XLM-RoBERTa", "NLP", "Zero-shot", "FastText"] },
            { label: "Sécurité", tags: ["Nmap", "ffuf", "SSTI / RCE", "CTF", "Kali Linux", "GPG"] },
        ],
        projTitle: "Projets",
        proj: [
            { name: "NLU multilingue", desc: "Détection d'intention & remplissage de slots en zero-shot (anglais → français sans données FR). GRU / Transformer / XLM-RoBERTa." },
            { name: "Audit Cyber", desc: "Pentest complet sur HackTheBox (SSTI → dump credentials → RCE pickle → root via brute-force GPG)." },
            { name: "Portfolio 3D", desc: "Portfolio interactif Three.js avec mini-jeu, i18n, backend conteneurisé (FastAPI + PostgreSQL + Nginx)." },
            { name: "Jeu spatial 3D", desc: "Jeu multijoueur temps réel — Three.js / WebGL, backend Go, WebSockets + Protobuf, Docker Compose." },
            { name: "Dominion (C++)", desc: "Recréation complète du jeu de cartes avec UI OpenGL from scratch, MiniAudio, composants sur mesure." },
            { name: "Éco App", desc: "Application de suivi d'impact écologique." },
        ],
        langTitle: "Langues",
        langs: [
            { fi: "fr", name: "Français", level: "Natif" },
            { fi: "gb", name: "Anglais", level: "Bilingue · TOEIC 980" },
            { fi: "jp", name: "Japonais", level: "A2" },
            { fi: "de", name: "Allemand", level: "A2" },
        ],
        contacts: [
            { label: "matys@grangaud.org", href: "mailto:matys@grangaud.org" },
            { label: "linkedin.com/in/matys-grangaud", href: "https://linkedin.com/in/matys-grangaud-050718386" },
            { label: "github.com/Zephiel42", href: "https://github.com/Zephiel42" },
        ],
        hint: "← Fermer le panneau pour revenir à la scène 3D.",
    },
};

export default function QuickResume() {
    const { lang } = useLang();
    const t = T[lang as keyof typeof T] ?? T.en;

    return (
        <div style={S.page}>
            {/* Header */}
            <div style={S.header}>
                <h1 style={S.name}>Matys Grangaud</h1>
                <div style={S.role}>{t.role}</div>
                <div style={S.contacts}>
                    {t.contacts.map(c => (
                        <a key={c.href} href={c.href} target="_blank" rel="noopener noreferrer" style={S.contact}>
                            {c.label}
                        </a>
                    ))}
                </div>
            </div>

            <hr style={S.hr} />

            {/* Experience */}
            <h2 style={S.h2}>{t.expTitle}</h2>
            {t.exp.map(e => (
                <div key={e.place} style={{ marginBottom: 12 }}>
                    <div style={S.row}>
                        <span style={S.date}>{e.date}</span>
                        <span style={S.place}>{e.place}</span>
                    </div>
                    <div style={{ ...S.desc, paddingLeft: 112 }}>{e.desc}</div>
                </div>
            ))}

            <hr style={S.hr} />

            {/* Education */}
            <h2 style={S.h2}>{t.eduTitle}</h2>
            {t.edu.map(e => (
                <div key={e.place} style={{ marginBottom: 8 }}>
                    <div style={S.row}>
                        <span style={S.date}>{e.date}</span>
                        <span style={S.place}>{e.place}</span>
                    </div>
                    <div style={{ ...S.desc, paddingLeft: 112 }}>{e.desc}</div>
                </div>
            ))}

            <hr style={S.hr} />

            {/* Skills */}
            <h2 style={S.h2}>{t.skillsTitle}</h2>
            {t.skills.map(g => (
                <div key={g.label} style={S.tagGroup}>
                    <div style={S.tagLabel}>{g.label}</div>
                    <div>{g.tags.map(tag => <span key={tag} style={S.tag}>{tag}</span>)}</div>
                </div>
            ))}

            <hr style={S.hr} />

            {/* Projects */}
            <h2 style={S.h2}>{t.projTitle}</h2>
            {t.proj.map(p => (
                <div key={p.name} style={S.projRow}>
                    <span style={S.projName}>{p.name}</span>
                    <span style={S.projDesc}>{p.desc}</span>
                </div>
            ))}

            <hr style={S.hr} />

            {/* Languages */}
            <h2 style={S.h2}>{t.langTitle}</h2>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" as const }}>
                {t.langs.map(l => (
                    <div key={l.name} style={S.langRow}>
                        <span className={`fi fi-${l.fi}`} style={{ fontSize: 13, borderRadius: 2 }} />
                        <span style={S.langName}>{l.name}</span>
                        <span style={S.langLvl}>{l.level}</span>
                    </div>
                ))}
            </div>

            <p style={S.hint}>{t.hint}</p>
        </div>
    );
}
