import { CardDef } from "../../pages/game/types";
import { TURRET_HP } from "../../pages/game/constants";
import { useLang } from "../../context/LangContext";

interface Props {
    hp:         number;
    score:      number;
    bestScore:  number;
    gameOver:   boolean;
    cardChoice: CardDef[] | null;
    turretHp:   number | null;
    activeBuff: "orbit" | "auto" | null;
    onRestart:  () => void;
    onCardPick: (card: CardDef) => void;
}

export default function GameHUD({ hp, score, bestScore, gameOver, cardChoice, turretHp, activeBuff, onRestart, onCardPick }: Props) {
    const { t } = useLang();
    const hpColor = hp > 50 ? "#06d6a0" : hp > 25 ? "#ffd166" : "#e63946";

    return (
        <>
            {/* Stats — bottom left */}
            <div style={{ position:"fixed", bottom:50, left:16, zIndex:15, fontFamily:"sans-serif", userSelect:"none", pointerEvents:"none" }}>
                <div style={{ marginBottom:6 }}>
                    <div style={{ color:"#aaa", fontSize:11, marginBottom:3 }}>HP  {hp} / 100</div>
                    <div style={{ width:180, height:10, background:"rgba(255,255,255,0.1)", borderRadius:5 }}>
                        <div style={{ width:`${Math.max(0,hp)}%`, height:"100%", background:hpColor, borderRadius:5, transition:"width 0.15s, background 0.3s" }} />
                    </div>
                </div>

                {turretHp !== null && (
                    <div style={{ marginBottom:6 }}>
                        <div style={{ color:"#aaa", fontSize:11, marginBottom:3 }}>Turret  {turretHp} / {TURRET_HP}</div>
                        <div style={{ width:180, height:7, background:"rgba(255,255,255,0.1)", borderRadius:4 }}>
                            <div style={{ width:`${Math.max(0,(turretHp/TURRET_HP)*100)}%`, height:"100%", background:"#06d6a0", borderRadius:4, transition:"width 0.15s" }} />
                        </div>
                    </div>
                )}

                <div style={{ color:"#ffd166", fontSize:12 }}>Score  {score}</div>
                <div style={{ color:"#666",    fontSize:11 }}>Best   {bestScore}</div>

                {activeBuff && (
                    <div style={{ color:"#4cc9f0", fontSize:10, marginTop:4 }}>
                        {activeBuff === "orbit" ? "⚡ Orbital Shield" : "⚡ Auto-Cannon"}
                    </div>
                )}
            </div>

            {/* Card choice overlay */}
            {cardChoice && (
                <div style={{
                    position:"fixed", inset:0, zIndex:60,
                    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                    background:"rgba(0,0,0,0.75)", backdropFilter:"blur(8px)", fontFamily:"sans-serif",
                }}>
                    <div style={{ color:"#fff", fontSize:22, fontWeight:700, letterSpacing:4, marginBottom:6 }}>
                        {t.game.chooseCard.toUpperCase()}
                    </div>
                    <div style={{ color:"#666", fontSize:12, marginBottom:36 }}>{t.game.paused}</div>
                    <div style={{ display:"flex", gap:24 }}>
                        {cardChoice.map(card => {
                            const cardT = t.game.cards[card.type];
                            return (
                            <button
                                key={card.type}
                                onClick={() => onCardPick(card)}
                                style={{
                                    width:190, padding:"28px 18px",
                                    borderRadius:14,
                                    background:"rgba(10,10,30,0.8)",
                                    border:`2px solid ${card.color}`,
                                    color:"#fff", cursor:"pointer", textAlign:"center",
                                    transition:"transform 0.15s, box-shadow 0.15s",
                                    boxShadow:`0 0 18px ${card.color}55`,
                                }}
                                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.07)"; e.currentTarget.style.boxShadow = `0 0 32px ${card.color}99`; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)";    e.currentTarget.style.boxShadow = `0 0 18px ${card.color}55`; }}
                            >
                                <div style={{ color:card.color, fontSize:15, fontWeight:700, marginBottom:10, letterSpacing:1 }}>
                                    {cardT?.label}
                                </div>
                                <div style={{ fontSize:11, color:"#bbb", lineHeight:1.6 }}>
                                    {cardT?.description}
                                </div>
                            </button>
                        );})}
                    </div>
                </div>
            )}

            {/* Game Over overlay */}
            {gameOver && (
                <div style={{ position:"fixed", inset:0, zIndex:50, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.6)", backdropFilter:"blur(4px)", fontFamily:"sans-serif" }}>
                    <div style={{ color:"#e63946", fontSize:48, fontWeight:700, letterSpacing:4, marginBottom:12 }}>GAME OVER</div>
                    <div style={{ color:"#ffd166", fontSize:22, marginBottom:4 }}>Score: {score}</div>
                    <div style={{ color:"#888",    fontSize:14, marginBottom:32 }}>Best: {bestScore}</div>
                    <button onClick={onRestart} style={{ background:"#06d6a0", border:"none", borderRadius:8, color:"#000", fontWeight:700, fontSize:16, padding:"12px 32px", cursor:"pointer" }}>
                        Continue
                    </button>
                </div>
            )}
        </>
    );
}
