import { useLang } from "../../context/LangContext";

const T = {
    en: {
        meta: "Profile · Sports",
        title: "Sports",
        tennis: "Tennis",
        tennisDesc: "I've been playing since I was young. I play for fun more than competition. Good rallies and varied points are more satisfying than winning on errors.",
        swim: "Swimming",
        swimDesc: "I swim regularly. One of the few activities where you're completely cut off: no sound, no screen, just movement and rhythm. Good for clearing the head.",
        hint: "← Close panel to return to the 3D scene.",
    },
    fr: {
        meta: "Profil · Sports",
        title: "Sports",
        tennis: "Tennis",
        tennisDesc: "Je joue depuis que je suis jeune. Je joue pour le plaisir plus que pour la compétition. De bons échanges et des points variés sont plus satisfaisants que gagner sur des erreurs adverses.",
        swim: "Natation",
        swimDesc: "Je nage régulièrement. Une des rares activités où l'on est complètement coupé : pas de son, pas d'écran, juste le mouvement et le rythme. Efficace pour vider la tête.",
        hint: "← Fermer le panneau pour revenir à la scène 3D.",
    },
};

const S = {
    page: {
        background: "#0d0d1a", color: "#ddd", minHeight: "100vh",
        padding: "40px 36px", fontFamily: "sans-serif", boxSizing: "border-box" as const,
    },
    meta: {
        color: "#3a86ff", fontWeight: 600, fontSize: 13,
        letterSpacing: 1, textTransform: "uppercase" as const, marginBottom: 6,
    },
    title: { color: "#ffffff", marginTop: 4, marginBottom: 32, fontSize: 26 },
    card: {
        display: "flex", gap: 20, marginBottom: 32, alignItems: "flex-start",
    },
    icon: {
        width: 100, height: 100, borderRadius: 10, flexShrink: 0,
        background: "rgba(58,134,255,0.08)", border: "1px solid rgba(58,134,255,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44,
    },
    textCol: { display: "flex", flexDirection: "column" as const, gap: 6 },
    cardTitle: { color: "#3a86ff", fontWeight: 700, fontSize: 15, letterSpacing: 0.5 },
    desc: { color: "#aaa", fontSize: 13, lineHeight: 1.75, margin: 0 },
    hr: { border: "none", borderTop: "1px solid rgba(255,255,255,0.07)", margin: "4px 0 28px" },
    hint: { color: "#555", fontSize: 12 },
};

export default function Sports() {
    const { lang } = useLang();
    const t = T[lang as keyof typeof T] ?? T.en;
    return (
        <div style={S.page}>
            <div style={S.meta}>{t.meta}</div>
            <h1 style={S.title}>{t.title}</h1>

            <div style={S.card}>
                <div style={S.icon}>🎾</div>
                <div style={S.textCol}>
                    <div style={S.cardTitle}>{t.tennis}</div>
                    <p style={S.desc}>{t.tennisDesc}</p>
                </div>
            </div>
            <hr style={S.hr} />

            <div style={S.card}>
                <div style={S.icon}>🏊</div>
                <div style={S.textCol}>
                    <div style={S.cardTitle}>{t.swim}</div>
                    <p style={S.desc}>{t.swimDesc}</p>
                </div>
            </div>

            <hr style={{ ...S.hr, marginTop: 4 }} />
            <p style={S.hint}>{t.hint}</p>
        </div>
    );
}
