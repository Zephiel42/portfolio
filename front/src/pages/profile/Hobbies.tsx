import { useLang } from "../../context/LangContext";

const T = {
    en: {
        meta: "Profile · Hobbies",
        title: "Hobbies",
        reading: "Reading",
        readingDesc: "Fantasy is my main genre — the Farseer trilogy by Robin Hobb is a firm favourite. I also read across other genres when something catches my attention.",
        games: "Video Games",
        gamesDesc: "I look for games that make me think or feel something. Outer Wilds is the best I've played: a mystery about the end of the world that you solve by exploring and paying attention. Nothing else quite like it.",
        chess: "Chess",
        chessDesc: "I play on Chess.com, currently rated around 1550. Mostly rapid games. I enjoy the strategy more than the competition.",
        cards: "Card Games",
        cardsDesc: "Magic: The Gathering (limited formats), and various other card games. I like the combinatorics and the moment when a plan comes together.",
        hint: "← Close panel to return to the 3D scene.",
    },
    fr: {
        meta: "Profil · Loisirs",
        title: "Loisirs",
        reading: "Lecture",
        readingDesc: "La fantasy est mon genre de prédilection — la trilogie de l'Assassin Royal de Robin Hobb est en tête de liste. Je lis aussi d'autres genres quand quelque chose attire mon attention.",
        games: "Jeux Vidéo",
        gamesDesc: "Je cherche des jeux qui font réfléchir ou ressentir quelque chose. Outer Wilds est le meilleur que j'aie joué : un mystère sur la fin du monde que l'on résout en explorant et en observant. Rien d'autre n'y ressemble.",
        chess: "Échecs",
        chessDesc: "Je joue sur Chess.com, actuellement autour de 1550. Principalement des parties rapides. J'apprécie la stratégie plus que la compétition.",
        cards: "Jeux de Cartes",
        cardsDesc: "Magic: The Gathering (formats limités), et divers autres jeux de cartes. J'aime la combinatoire et le moment où un plan se réalise.",
        hint: "← Fermer le panneau pour revenir à la scène 3D.",
    },
};

const S = {
    page: {
        background: "#0d0d1a", color: "#ddd", minHeight: "100vh",
        padding: "40px 36px", fontFamily: "sans-serif", boxSizing: "border-box" as const,
    },
    meta: {
        color: "#f77f00", fontWeight: 600, fontSize: 13,
        letterSpacing: 1, textTransform: "uppercase" as const, marginBottom: 6,
    },
    title: { color: "#ffffff", marginTop: 4, marginBottom: 32, fontSize: 26 },
    card: {
        display: "flex", gap: 20, marginBottom: 32,
        alignItems: "flex-start",
    },
    img: {
        width: 120, height: 120, objectFit: "cover" as const,
        borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0,
    },
    textCol: { display: "flex", flexDirection: "column" as const, gap: 6 },
    cardTitle: { color: "#f77f00", fontWeight: 700, fontSize: 15, letterSpacing: 0.5 },
    desc: { color: "#aaa", fontSize: 13, lineHeight: 1.75, margin: 0 },
    hr: { border: "none", borderTop: "1px solid rgba(255,255,255,0.07)", margin: "4px 0 28px" },
    hint: { color: "#555", fontSize: 12 },
};

export default function Hobbies() {
    const { lang } = useLang();
    const t = T[lang as keyof typeof T] ?? T.en;
    return (
        <div style={S.page}>
            <div style={S.meta}>{t.meta}</div>
            <h1 style={S.title}>{t.title}</h1>

            <div style={S.card}>
                <img src="/profil/books/royal assassin.jpg" alt="Royal Assassin" style={S.img} />
                <div style={S.textCol}>
                    <div style={S.cardTitle}>{t.reading}</div>
                    <p style={S.desc}>{t.readingDesc}</p>
                </div>
            </div>
            <hr style={S.hr} />

            <div style={S.card}>
                <img src="/profil/hobbies/outerwild.jpeg" alt="Outer Wilds" style={S.img} />
                <div style={S.textCol}>
                    <div style={S.cardTitle}>{t.games}</div>
                    <p style={S.desc}>{t.gamesDesc}</p>
                </div>
            </div>
            <hr style={S.hr} />

            <div style={S.card}>
                <img src="/profil/hobbies/5Dchess.jpg" alt="5D Chess" style={S.img} />
                <div style={S.textCol}>
                    <div style={S.cardTitle}>{t.chess}</div>
                    <p style={S.desc}>{t.chessDesc}</p>
                </div>
            </div>
            <hr style={S.hr} />

            <div style={S.card}>
                <img src="/profil/hobbies/iona.jpg" alt="MTG card" style={S.img} />
                <div style={S.textCol}>
                    <div style={S.cardTitle}>{t.cards}</div>
                    <p style={S.desc}>{t.cardsDesc}</p>
                </div>
            </div>

            <hr style={{ ...S.hr, marginTop: 4 }} />
            <p style={S.hint}>{t.hint}</p>
        </div>
    );
}
