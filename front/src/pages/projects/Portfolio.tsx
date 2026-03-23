import { useLang } from "../../context/LangContext";
import { GITHUB_PORTFOLIO } from "../../config/links";

const T = {
    en: {
        year: "2026",
        title: "This portfolio",
        tags: [
            "React",
            "TypeScript",
            "Three.js",
            "FastAPI",
            "PostgreSQL",
            "Docker",
            "nginx",
            "Anubis",
            "AI-assisted",
        ],
        p1: "An interactive 3D portfolio built around a navigable scene rather than a static page. The player controls a cube that can jump across the scene, interact with objects, and open embedded content panels. Each face of the orientation gizmo corresponds to a different section.",
        p2: "The backend exposes a REST API that persists scene object positions across sessions. Objects are seeded per face and their positions saved on landing, so the scene remembers where things were left. A live book recommendation system lets visitors submit and upvote titles stored in PostgreSQL.",
        p3: "The mini-game on the back face is a real-time wave shooter. Enemies scale in difficulty over time. Gold mystery boxes spawn periodically — walking into one pauses the game and offers a choice of three cards (Meteor Storm, Orbital Shield, Auto-Cannon, Deploy Turret, and their upgrades). Score and best score are persisted in localStorage.",
        hint: "← Close panel to return to the 3D scene.",
    },
    fr: {
        year: "2025 – 2026",
        title: "Ce portfolio",
        tags: [
            "React",
            "TypeScript",
            "Three.js",
            "FastAPI",
            "PostgreSQL",
            "Docker",
            "nginx",
            "Anubis",
            "Assisté par IA",
        ],
        p1: "Un portfolio 3D interactif construit autour d'une scène navigable plutôt qu'une page statique. Le joueur contrôle un cube qui peut sauter dans la scène, interagir avec des objets et ouvrir des panneaux de contenu intégrés. Chaque face du gizmo d'orientation correspond à une section différente.",
        p2: "Le backend expose une API REST qui persiste les positions des objets de scène entre les sessions. Les objets sont seedés par face et leurs positions sauvegardées à l'atterrissage. Un système de recommandation de livres en direct permet aux visiteurs de soumettre et voter pour des titres stockés dans PostgreSQL.",
        p3: "Le mini-jeu sur la face arrière est un shooter en vagues temps réel. Les ennemis gagnent en difficulté au fil du temps. Des coffres mystère dorés apparaissent périodiquement — en marchant dessus, le jeu se met en pause et propose un choix parmi trois cartes (Pluie de météores, Bouclier orbital, Canon automatique, Tourelle, et leurs améliorations). Le score et le meilleur score sont persistés en localStorage.",
        hint: "← Fermer le panneau pour revenir à la scène 3D.",
    },
};

const ACCENT = "#4488ff";

const S = {
    page: {
        background: "#0d0d1a",
        color: "#ddd",
        minHeight: "100vh",
        padding: "40px 36px",
        fontFamily: "sans-serif",
        boxSizing: "border-box" as const,
    },
    year: {
        color: ACCENT,
        fontWeight: 600,
        fontSize: 13,
        letterSpacing: 1,
        textTransform: "uppercase" as const,
        marginBottom: 6,
    },
    title: {
        color: "#ffffff",
        marginTop: 4,
        marginBottom: 20,
        fontSize: 26,
        lineHeight: 1.3,
    },
    tag: {
        display: "inline-block",
        background: "rgba(68,136,255,0.15)",
        color: "#6699ff",
        border: "1px solid rgba(68,136,255,0.4)",
        borderRadius: 4,
        padding: "3px 10px",
        fontSize: 12,
        marginRight: 6,
        marginBottom: 6,
    },
    section: { color: "#aaa", lineHeight: 1.85, marginTop: 0 },
    p: { marginBottom: 12, marginTop: 0 },
    h2: {
        color: "#6699ff",
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: 2,
        textTransform: "uppercase" as const,
        marginBottom: 10,
        marginTop: 0,
    },
    hr: {
        border: "none",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        margin: "28px 0",
    },
    hint: { color: "#555", fontSize: 12 },
};

export default function Portfolio() {
    const { lang } = useLang();
    const t = T[lang as keyof typeof T] ?? T.en;
    return (
        <div style={S.page}>
            <div style={S.year}>{t.year}</div>
            <h1 style={S.title}>{t.title}</h1>
            <div style={{ marginBottom: 20 }}>
                {t.tags.map((tag) => (
                    <span key={tag} style={S.tag}>
                        {tag}
                    </span>
                ))}
            </div>
            <div style={S.section}>
                <p style={S.p}>{t.p1}</p>
                <p style={S.p}>{t.p2}</p>
                <p style={S.p}>{t.p3}</p>
            </div>
            <hr style={S.hr} />
            <a
                href={GITHUB_PORTFOLIO}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    color: ACCENT, fontSize: 13, textDecoration: "none",
                    background: "rgba(68,136,255,0.1)", border: "1px solid rgba(68,136,255,0.3)",
                    borderRadius: 6, padding: "7px 14px", marginBottom: 24,
                }}
            >
                <span style={{ fontWeight: 700 }}>⌥</span> github.com/Zephiel42/portfolio ↗
            </a>
            <br />
            <p style={S.hint}>{t.hint}</p>
        </div>
    );
}
