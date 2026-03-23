import { useLang } from "../../context/LangContext";
import { CONTACT_CARDS } from "../../config/links";

const T = {
    en: {
        meta: "Get in touch",
        title: "Contact",
        sub: "Feel free to reach out for collaborations, opportunities, or just a chat.",
        github: "Source code, projects and contributions",
        linkedin: "Professional profile and experience",
        email: "Direct contact",
        hint: "← Close panel to return to the 3D scene.",
    },
    fr: {
        meta: "Me contacter",
        title: "Contact",
        sub: "N'hésitez pas à me contacter pour des collaborations, opportunités, ou simplement discuter.",
        github: "Code source, projets et contributions",
        linkedin: "Profil professionnel et expériences",
        email: "Contact direct",
        hint: "← Fermer le panneau pour revenir à la scène 3D.",
    },
};

const LINKS = CONTACT_CARDS;

const S = {
    page: {
        background: "#0d0d1a",
        color: "#ddd",
        minHeight: "100vh",
        padding: "40px 36px",
        fontFamily: "sans-serif",
        boxSizing: "border-box" as const,
    },
    meta: {
        color: "#7209b7",
        fontWeight: 600,
        fontSize: 13,
        letterSpacing: 1,
        textTransform: "uppercase" as const,
        marginBottom: 6,
    },
    title: {
        color: "#ffffff",
        marginTop: 4,
        marginBottom: 6,
        fontSize: 26,
        lineHeight: 1.3,
    },
    sub: {
        color: "#888",
        fontSize: 14,
        marginBottom: 32,
        maxWidth: 480,
        lineHeight: 1.7,
    },
    card: {
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "16px 20px",
        borderRadius: 10,
        marginBottom: 14,
        textDecoration: "none",
        color: "#ddd",
        transition: "filter 0.15s",
    },
    icon: {
        width: 40,
        height: 40,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
        fontWeight: 700,
        flexShrink: 0,
    },
    info: { display: "flex", flexDirection: "column" as const },
    lbl: { fontWeight: 600, fontSize: 15, marginBottom: 2 },
    val: { fontSize: 12, opacity: 0.6 },
    desc: { fontSize: 12, opacity: 0.5, marginTop: 3 },
    hr: {
        border: "none",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        margin: "32px 0",
    },
    hint: { color: "#555", fontSize: 12 },
};

export default function Contact() {
    const { lang } = useLang();
    const t = T[lang];
    return (
        <div style={S.page}>
            <div style={S.meta}>{t.meta}</div>
            <h1 style={S.title}>{t.title}</h1>
            <div style={S.sub}>{t.sub}</div>

            {LINKS.map((link) => (
                <a
                    key={link.key}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        ...S.card,
                        background: link.bg,
                        border: `1px solid ${link.border}`,
                    }}
                >
                    <div
                        style={{
                            ...S.icon,
                            background: link.bg,
                            border: `1px solid ${link.border}`,
                            color: link.color,
                        }}
                    >
                        {link.icon}
                    </div>
                    <div style={S.info}>
                        <span style={{ ...S.lbl, color: link.color }}>
                            {link.label}
                        </span>
                        <span style={S.val}>{link.value}</span>
                        <span style={S.desc}>{t[link.key]}</span>
                    </div>
                    <span
                        style={{
                            marginLeft: "auto",
                            color: "rgba(255,255,255,0.2)",
                            fontSize: 18,
                        }}
                    >
                        ↗
                    </span>
                </a>
            ))}

            <hr style={S.hr} />
            <p style={S.hint}>{t.hint}</p>
        </div>
    );
}
