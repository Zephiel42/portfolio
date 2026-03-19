import { useLang } from "../../context/LangContext";

const T = {
    en: {
        year: "2025",
        title: "Multilingual NLU — Intent Detection & Slot Filling",
        tags: ["NLP", "Zero-Shot", "XLM-RoBERTa", "FastText", "GRU", "Transformer", "PyTorch", "BIO Tagging"],
        intro: <>Research project on <strong style={{color:"#eee"}}>Natural Language Understanding (NLU)</strong>, building a zero-shot multilingual system capable of jointly solving intent detection and slot filling — trained on English, evaluated on French without any French training data.</>,
        problemTitle: "Problem",
        problem: "Most NLU systems need large annotated datasets for each language they support, which makes multilingual coverage expensive. Zero-shot transfer sidesteps this by training on a single resource-rich language (English) and evaluating directly on another (French) with no French training data at all. The hard part is getting the model to learn representations that hold across languages, while also benefiting from solving intent and slot tasks jointly.",
        dataTitle: "Data — MASSIVE NLU Corpus",
        data: "Each language file contains over 16,000 utterances with fields: intent label, annotated utterance (Annot_utt with slot tags), scenario, and judgement metadata. Only intent and Annot_utt were retained for training.",
        bioTitle: "BIO Alignment Strategy",
        bio: <>Slot filling is framed as sequence labelling. Each token receives a <strong style={{color:"#eee"}}>B-slot</strong> (beginning), <strong style={{color:"#eee"}}>I-slot</strong> (inside), or <strong style={{color:"#eee"}}>O</strong> (outside) label. Multilingual transformer tokenizers (WordPiece / BPE) split words into sub-tokens, requiring alignment between word-level slot annotations and token-level inputs. Rather than aligning by word boundaries (which breaks on sub-tokens like "9h30" → ["9", "##h", "30"]), alignment is performed on character offsets from the original utterance, guaranteeing robustness across languages and tokenisation schemes.</>,
        modelsTitle: "Models",
        m1title: "Transformer + XLM-RoBERTa (BIO)",
        m1: "Shared encoder (XLM-RoBERTa-base, pretrained on 100 languages) with two independent heads: intent from the CLS token, slots from per-token representations. Joint loss combining cross-entropy for both tasks. Training was done exclusively on English to respect the zero-shot setup. Hardware limited us to 1 epoch, which shows in the numbers: 77% intent accuracy, 34% slot F1.",
        m2title: "Transformer + FastText",
        m2: "A lighter approach: small transformer (8.2M parameters, two attention heads) with FastText embeddings. We started at 250 dimensions but cut to 100 to reduce overfitting, and applied class weights to handle the heavy imbalance in slot labels (most tokens are just O). Intent F1 dropped to 0.23, but slot F1 reached 0.80.",
        m3title: "GRU + FastText",
        m3: "Bidirectional GRU (3.12M parameters, 100-dim FastText, dropout 0.1). Reading in both directions gives each token full left and right context. Intent comes from the final hidden state, slots from per-token hidden states, with both heads sharing the same encoder. This ended up being our best model: Intent F1 0.64, Slot F1 0.88.",
        resultsTitle: "Results Summary",
        team: "Polytech Paris-Saclay · ET5 IIM · Team: Antonin Djouder-Fey, Matys Grangaud",
        hint: "← Close panel to return to the 3D scene.",
    },
    fr: {
        year: "2025",
        title: "NLU multilingue — Détection d'Intention et Remplissage de Slots",
        tags: ["NLP", "Zero-Shot", "XLM-RoBERTa", "FastText", "GRU", "Transformer", "PyTorch", "Étiquetage BIO"],
        intro: <>Projet de recherche sur la <strong style={{color:"#eee"}}>compréhension du langage naturel (NLU)</strong>, consistant à construire un système zero-shot multilingue capable de résoudre conjointement la détection d'intention et le remplissage de slots — entraîné en anglais, évalué en français sans aucune donnée française d'entraînement.</>,
        problemTitle: "Problème",
        problem: "La plupart des systèmes NLU ont besoin de grandes quantités de données annotées pour chaque langue, ce qui rend la couverture multilingue coûteuse. Le transfert zero-shot contourne ça en entraînant sur une seule langue riche en ressources (l'anglais) et en évaluant directement sur une autre (le français), sans aucune donnée française à l'entraînement. La difficulté, c'est d'apprendre des représentations qui restent pertinentes d'une langue à l'autre, tout en tirant parti de la résolution conjointe des deux tâches.",
        dataTitle: "Données — Corpus MASSIVE NLU",
        data: "Chaque fichier par langue contient plus de 16 000 énoncés avec les champs : label d'intention, énoncé annoté (Annot_utt avec tags de slots), scénario et métadonnées de jugement. Seuls l'intention et l'Annot_utt ont été conservés pour l'entraînement.",
        bioTitle: "Stratégie d'alignement BIO",
        bio: <>Le remplissage de slots est formulé comme un étiquetage de séquence. Chaque token reçoit une étiquette <strong style={{color:"#eee"}}>B-slot</strong> (début), <strong style={{color:"#eee"}}>I-slot</strong> (continuation) ou <strong style={{color:"#eee"}}>O</strong> (hors entité). Les tokenizers multilingues (WordPiece / BPE) fractionnent les mots en sous-tokens, nécessitant un alignement entre les annotations au niveau des mots et les entrées au niveau des tokens. Plutôt que d'aligner par frontières de mots (qui échoue sur les sous-tokens comme "9h30" → ["9", "##h", "30"]), l'alignement est effectué sur les offsets de caractères de l'énoncé original, garantissant une robustesse indépendante de la langue et du schéma de tokenisation.</>,
        modelsTitle: "Modèles",
        m1title: "Transformer + XLM-RoBERTa (BIO)",
        m1: "Encodeur partagé (XLM-RoBERTa-base, pré-entraîné sur 100 langues) avec deux têtes indépendantes : l'intention depuis le token CLS, les slots depuis les représentations par token. Perte conjointe combinant l'entropie croisée des deux tâches. L'entraînement a été fait exclusivement en anglais pour respecter la contrainte zero-shot. Les limites matérielles nous ont contraints à 1 epoch, ce qui se voit dans les résultats : 77% de précision d'intent, 34% de F1 slot.",
        m2title: "Transformer + FastText",
        m2: "Une approche plus légère : petit transformer (8,2M paramètres, deux têtes d'attention) avec des embeddings FastText. On a commencé à 250 dimensions puis réduit à 100 pour limiter le surapprentissage, et appliqué des poids de classe pour compenser le fort déséquilibre des labels de slots (la majorité sont des O). Le F1 intent est tombé à 0,23, mais le F1 slot a atteint 0,80.",
        m3title: "GRU + FastText",
        m3: "GRU bidirectionnel (3,12M paramètres, FastText 100 dimensions, dropout 0,1). Lire dans les deux sens donne à chaque token le contexte complet à gauche et à droite. L'intention vient de l'état caché final, les slots des états cachés par token, les deux têtes partageant le même encodeur. C'est notre meilleur modèle au final : F1 intent 0,64, F1 slot 0,88.",
        resultsTitle: "Résultats",
        team: "Polytech Paris-Saclay · ET5 IIM · Équipe : Antonin Djouder-Fey, Matys Grangaud",
        hint: "← Fermer le panneau pour revenir à la scène 3D.",
    },
};

const ACCENT = "#7b2ff7";

const S = {
    page:    { background:"#0d0d1a", color:"#ddd", minHeight:"100vh", padding:"40px 36px", fontFamily:"sans-serif", boxSizing:"border-box" as const },
    year:    { color:ACCENT, fontWeight:600, fontSize:13, letterSpacing:1, textTransform:"uppercase" as const, marginBottom:6 },
    title:   { color:"#ffffff", marginTop:4, marginBottom:20, fontSize:26, lineHeight:1.3 },
    tag:     { display:"inline-block", background:"rgba(123,47,247,0.15)", color:"#b57bff", border:"1px solid rgba(123,47,247,0.4)", borderRadius:4, padding:"3px 10px", fontSize:12, marginRight:6, marginBottom:6 },
    h2:      { color:"#b57bff", fontSize:13, fontWeight:700, letterSpacing:2, textTransform:"uppercase" as const, marginBottom:10, marginTop:0 },
    section: { color:"#aaa", lineHeight:1.85, marginTop:0 },
    p:       { marginBottom:12, marginTop:0 },
    hr:      { border:"none", borderTop:"1px solid rgba(255,255,255,0.07)", margin:"26px 0" },
    hint:    { color:"#555", fontSize:12 },
    team:    { color:"#888", fontSize:13, fontStyle:"italic" as const },
};

const RESULTS = [
    { model: "Transformer XLM-RoBERTa (1 epoch)", intentF1: "—", slotF1: "0.34", note: "Hardware limited" },
    { model: "Transformer + FastText",             intentF1: "0.23", slotF1: "0.80", note: "" },
    { model: "GRU + FastText",                     intentF1: "0.64", slotF1: "0.88", note: "Best overall" },
];

export default function NLU() {
    const { lang } = useLang();
    const t = T[lang as keyof typeof T] ?? T.en;

    return (
        <div style={S.page}>
            <div style={S.year}>{t.year}</div>
            <h1 style={S.title}>{t.title}</h1>
            <div style={{marginBottom:20}}>{t.tags.map(tag => <span key={tag} style={S.tag}>{tag}</span>)}</div>

            <div style={S.section}><p style={S.p}>{t.intro}</p></div>
            <hr style={S.hr} />

            <div style={{marginBottom:22}}>
                <h2 style={S.h2}>{t.problemTitle}</h2>
                <div style={S.section}><p style={S.p}>{t.problem}</p></div>
            </div>

            <div style={{marginBottom:22}}>
                <h2 style={S.h2}>{t.dataTitle}</h2>
                <div style={S.section}><p style={S.p}>{t.data}</p></div>
            </div>

            <div style={{marginBottom:22}}>
                <h2 style={S.h2}>{t.bioTitle}</h2>
                <div style={S.section}><p style={S.p}>{t.bio}</p></div>
            </div>
            <hr style={S.hr} />

            <div style={{marginBottom:22}}>
                <h2 style={S.h2}>{t.modelsTitle}</h2>
                {([
                    [t.m1title, t.m1],
                    [t.m2title, t.m2],
                    [t.m3title, t.m3],
                ] as [string, string][]).map(([title, body]) => (
                    <div key={title} style={{marginBottom:18}}>
                        <div style={{color:"#ddd", fontWeight:600, marginBottom:6}}>{title}</div>
                        <div style={S.section}><p style={S.p}>{body}</p></div>
                    </div>
                ))}
            </div>
            <hr style={S.hr} />

            <div style={{marginBottom:22}}>
                <h2 style={S.h2}>{t.resultsTitle}</h2>
                <table style={{borderCollapse:"collapse", fontSize:13, color:"#aaa", width:"100%", maxWidth:560}}>
                    <thead>
                        <tr style={{color:"#777", borderBottom:"1px solid rgba(255,255,255,0.1)"}}>
                            <th style={{textAlign:"left", padding:"6px 12px 6px 0", fontWeight:500}}>Model</th>
                            <th style={{textAlign:"center", padding:"6px 12px", fontWeight:500}}>Intent F1</th>
                            <th style={{textAlign:"center", padding:"6px 12px", fontWeight:500}}>Slot F1</th>
                            <th style={{textAlign:"left", padding:"6px 0 6px 12px", fontWeight:500}}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {RESULTS.map(r => (
                            <tr key={r.model} style={{borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                                <td style={{padding:"8px 12px 8px 0"}}>{r.model}</td>
                                <td style={{textAlign:"center", padding:"8px 12px", color: r.intentF1 === "—" ? "#555" : "#b57bff"}}>{r.intentF1}</td>
                                <td style={{textAlign:"center", padding:"8px 12px", color:"#b57bff"}}>{r.slotF1}</td>
                                <td style={{padding:"8px 0 8px 12px", color:"#666", fontSize:11}}>{r.note}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p style={S.team}>{t.team}</p>
            <hr style={S.hr} />
            <p style={S.hint}>{t.hint}</p>
        </div>
    );
}
