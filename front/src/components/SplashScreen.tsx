import { useState } from "react";
import { useLang } from "../context/LangContext";

interface Props { onEnter: () => void; }

const CORNERS: [string, string][] = [
    ["top", "left"], ["top", "right"], ["bottom", "left"], ["bottom", "right"],
];

export default function SplashScreen({ onEnter }: Props) {
    const { lang } = useLang();
    const [exiting, setExiting] = useState(false);

    const handleEnter = () => {
        setExiting(true);
        setTimeout(onEnter, 700);
    };

    return (
        <>
            <style>{`
                @keyframes _splashExit {
                    0%   { opacity:1; filter:brightness(1); }
                    20%  { opacity:1; filter:brightness(4) saturate(2); }
                    65%  { opacity:0; filter:brightness(2); }
                    100% { opacity:0; }
                }
                @keyframes _splashPulse {
                    0%,100% { box-shadow:0 0 18px rgba(68,136,255,0.35); }
                    50%     { box-shadow:0 0 38px rgba(68,136,255,0.75), 0 0 70px rgba(68,136,255,0.18); }
                }
                @keyframes _diamondGlow {
                    0%,100% { box-shadow:0 0 55px rgba(68,136,255,0.07); }
                    50%     { box-shadow:0 0 90px rgba(68,136,255,0.18); }
                }
                @keyframes _fadeUp {
                    from { opacity:0; transform:rotate(-45deg) translateY(14px); }
                    to   { opacity:1; transform:rotate(-45deg) translateY(0); }
                }
                @keyframes _btnFadeIn {
                    from { opacity:0; transform:translateX(-50%) translateY(8px); }
                    to   { opacity:1; transform:translateX(-50%) translateY(0); }
                }
                ._splashBtn:hover {
                    background: rgba(68,136,255,0.12) !important;
                    color: #fff !important;
                    letter-spacing: 5px !important;
                }
            `}</style>

            <div style={{
                position: "fixed", inset: 0, zIndex: 1000,
                background: "radial-gradient(ellipse at 50% 45%, #0d0d2e 0%, #060612 68%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "sans-serif",
                userSelect: "none",
                animation: exiting ? "_splashExit 0.7s forwards" : undefined,
                pointerEvents: exiting ? "none" : "auto",
            }}>

                {/* Corner brackets */}
                {CORNERS.map(([v, h]) => (
                    <div key={v + h} style={{
                        position: "absolute",
                        [v]: 28, [h]: 28,
                        width: 22, height: 22,
                        borderTop:    v === "top"    ? "1.5px solid rgba(68,136,255,0.25)" : undefined,
                        borderBottom: v === "bottom" ? "1.5px solid rgba(68,136,255,0.25)" : undefined,
                        borderLeft:   h === "left"   ? "1.5px solid rgba(68,136,255,0.25)" : undefined,
                        borderRight:  h === "right"  ? "1.5px solid rgba(68,136,255,0.25)" : undefined,
                    }} />
                ))}

                {/* Wrapper — gives room for diamond + button */}
                <div style={{ position: "relative", width: "min(480px, 92vw)", height: "min(560px, 90vh)" }}>

                    {/* Diamond card */}
                    <div style={{
                        position: "absolute",
                        top: "50%", left: "50%",
                        width: "min(340px, 68vmin)",
                        height: "min(340px, 68vmin)",
                        transform: "translate(-50%, -52%) rotate(45deg)",
                        background: "rgba(7,7,24,0.97)",
                        border: "1.5px solid rgba(68,136,255,0.32)",
                        animation: "_diamondGlow 3.5s ease-in-out infinite",
                    }}>
                        {/* Counter-rotated content */}
                        <div style={{
                            position: "absolute", inset: 0,
                            display: "flex", flexDirection: "column",
                            alignItems: "center", justifyContent: "center",
                            gap: 6,
                            animation: "_fadeUp 0.7s 0.15s ease both",
                            opacity: 0,
                        }}>
                            <img
                                src="/profil/profilPick.jpg"
                                alt="Matys Grangaud"
                                style={{
                                    width: "min(70px, 16vmin)",
                                    height: "min(70px, 16vmin)",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    border: "2px solid rgba(68,136,255,0.4)",
                                    marginBottom: 4,
                                }}
                            />
                            <h1 style={{
                                color: "#fff", margin: 0,
                                fontSize: "min(20px, 4.5vmin)",
                                fontWeight: 700, letterSpacing: 1,
                            }}>
                                Matys Grangaud
                            </h1>
                            <div style={{
                                color: "#4488ff",
                                fontSize: "min(9px, 2.2vmin)",
                                letterSpacing: 2.5,
                                textTransform: "uppercase",
                                fontWeight: 600,
                            }}>
                                Engineering Student · 2026
                            </div>
                            <div style={{
                                display: "flex", flexWrap: "wrap",
                                gap: 4, justifyContent: "center",
                                marginTop: 8,
                                maxWidth: "min(230px, 50vmin)",
                            }}>
                                {["Software", "Security", "AI", "Data"].map(tag => (
                                    <span key={tag} style={{
                                        background: "rgba(68,136,255,0.09)",
                                        border: "1px solid rgba(68,136,255,0.28)",
                                        color: "#6aafff",
                                        padding: "2px 9px",
                                        borderRadius: 3,
                                        fontSize: "min(9.5px, 2.2vmin)",
                                        letterSpacing: 0.5,
                                    }}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div style={{
                                color: "#444",
                                fontSize: "min(10px, 2.2vmin)",
                                textAlign: "center",
                                maxWidth: "min(190px, 44vmin)",
                                marginTop: 4, lineHeight: 1.55,
                            }}>
                                Polytech Paris-Saclay
                            </div>
                        </div>
                    </div>

                    {/* Enter button */}
                    <button
                        className="_splashBtn"
                        onClick={handleEnter}
                        style={{
                            position: "absolute",
                            bottom: "min(28px, 5vh)",
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "transparent",
                            border: "1.5px solid #4488ff",
                            color: "#4488ff",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: 4,
                            textTransform: "uppercase",
                            padding: "10px 38px",
                            borderRadius: 2,
                            cursor: "pointer",
                            animation: "_splashPulse 2.4s ease-in-out infinite, _btnFadeIn 0.7s 0.5s ease both",
                            opacity: 0,
                            transition: "background 0.2s, color 0.2s, letter-spacing 0.2s",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {lang === "fr" ? "Entrer" : "Enter"}
                    </button>
                </div>
            </div>
        </>
    );
}