import { useState, useEffect } from "react";
import { useLang } from "../context/LangContext";

const T = {
    en: {
        title: "Welcome",
        sub: "Here's how to navigate the portfolio",
        steps: [
            { icon: "🖱", text: "Drag to pan the camera" },
            { icon: "⚙", text: "Scroll or pinch to zoom" },
            { icon: "⬡", text: "Click the ground to jump there" },
            { icon: "◻", text: "Walk into a coloured cube to open it" },
            { icon: "◈", text: "Click a gizmo face or a shortcut button to switch section" },
        ],
        cta: "Got it",
    },
    fr: {
        title: "Bienvenue",
        sub: "Comment naviguer dans le portfolio",
        steps: [
            { icon: "🖱", text: "Glisser pour déplacer la caméra" },
            { icon: "⚙", text: "Molette ou pincer pour zoomer" },
            { icon: "⬡", text: "Cliquer sur le sol pour sauter" },
            { icon: "◻", text: "Marcher sur un cube coloré pour l'ouvrir" },
            { icon: "◈", text: "Cliquer sur une face du gizmo ou un bouton raccourci pour changer de section" },
        ],
        cta: "Compris !",
    },
};

export default function WelcomeOverlay() {
    const { lang } = useLang();
    const t = T[lang as keyof typeof T] ?? T.en;
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem("welcomed")) setVisible(true);
    }, []);

    if (!visible) return null;

    const dismiss = () => {
        localStorage.setItem("welcomed", "1");
        setVisible(false);
    };

    return (
        <div
            onMouseDown={e => e.stopPropagation()}
            onClick={dismiss}
            style={{
                position: "fixed", inset: 0, zIndex: 500,
                background: "rgba(0,0,10,0.82)", backdropFilter: "blur(8px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                animation: "panelFadeIn 0.3s ease",
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: "rgba(14,14,32,0.97)",
                    border: "1px solid rgba(68,136,255,0.25)",
                    borderRadius: 16,
                    padding: "36px 40px",
                    maxWidth: 420,
                    width: "90vw",
                    boxShadow: "0 16px 60px rgba(0,0,0,0.8)",
                    fontFamily: "sans-serif",
                }}
            >
                <h2 style={{ color: "#fff", margin: "0 0 4px 0", fontSize: 22, fontWeight: 700 }}>
                    {t.title}
                </h2>
                <p style={{ color: "#666", fontSize: 12, margin: "0 0 24px 0", letterSpacing: 1, textTransform: "uppercase" }}>
                    {t.sub}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
                    {t.steps.map((s, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                            <span style={{
                                fontSize: 18, width: 28, textAlign: "center", flexShrink: 0,
                                color: "#4488ff", marginTop: 1,
                            }}>
                                {s.icon}
                            </span>
                            <span style={{ color: "#bbb", fontSize: 13, lineHeight: 1.5 }}>
                                {s.text}
                            </span>
                        </div>
                    ))}
                </div>

                <button
                    onClick={dismiss}
                    style={{
                        width: "100%",
                        background: "rgba(68,136,255,0.18)",
                        border: "1px solid rgba(68,136,255,0.45)",
                        color: "#6aafff",
                        fontSize: 13,
                        fontWeight: 700,
                        fontFamily: "sans-serif",
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        padding: "10px 0",
                        borderRadius: 8,
                        cursor: "pointer",
                    }}
                >
                    {t.cta}
                </button>
            </div>
        </div>
    );
}
