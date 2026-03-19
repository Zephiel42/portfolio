import { useLang } from "../../context/LangContext";

const T = {
    en: {
        title: "My Views on AI",
        sub1: "Background",
        body1: [
            "I've worked with AI long enough to have an opinion grounded in practice. I've built systems around it, integrated it into real workflows, and used it as part of my day-to-day work rather than just experimenting with it.",
            "I've tested a range of code assistants and generative models for images and 3D, enough to have a clear sense of where each performs well and where it doesn't. It's not something I rely on for everything, but it's a tool I know how to use and, more importantly, how to evaluate.",
        ],
        sub2: "Opinions",
        body2: [
            "AI is genuinely capable, and ignoring it in technical or creative work puts you at a real disadvantage. The gap between people who use it well and those who don't is growing, and that's backed by enough practical evidence to take seriously.",
            'That said, using it well requires understanding what it actually does. Models don\'t truly "know" things; they retrieve and generate from statistical patterns. The concept of RAG makes this concrete: the model pulls relevant context and generates from it. Once you understand that mechanism, you prompt differently and you stop treating the output as ground truth.',
            "I saw this firsthand with a classmate who submitted AI-generated code without reading it. There was a security vulnerability in it. The model wasn't the problem: the prompt was vague and there was no review step. The AI produced exactly what it was asked for. The mistake was treating it as a substitute for understanding rather than a complement to it.",
            "The environmental cost is also worth acknowledging. Training large models is energy-intensive, and inference at scale adds up meaningfully. That's not an argument against using AI, but it is an argument for being deliberate: choosing the right model size for the task, avoiding unnecessary calls, and preferring infrastructure that runs on cleaner energy. Engineering tradeoffs like any other.",
            "Something that doesn't get discussed enough: what happens to the information environment when content generation becomes nearly free. Search results are already filling with low-quality generated text, and it's getting harder to find work that's actually authored by someone. Beyond that, the people whose work trained these models, writers, illustrators, musicians, are now competing with output built on their own work at a scale they can't match. These aren't hypothetical concerns. They're already measurable.",
        ],
    },
    fr: {
        title: "Mon regard sur l'IA",
        sub1: "Contexte",
        body1: [
            "J'ai assez travaillé avec l'IA pour avoir un avis ancré dans la pratique. J'ai construit des systèmes autour, intégré ces outils dans des workflows réels, et je les utilise dans mon travail quotidien plutôt que de juste les tester.",
            "J'ai essayé plusieurs assistants de code et modèles génératifs pour les images et la 3D, suffisamment pour avoir une idée concrète des points forts et des limites de chacun. Ce n'est pas quelque chose sur quoi je m'appuie pour tout, mais c'est un outil que je sais utiliser et, surtout, évaluer.",
        ],
        sub2: "Opinions",
        body2: [
            "L'IA est réellement capable, et ne pas l'intégrer dans un travail technique ou créatif crée un vrai désavantage. L'écart de productivité entre ceux qui l'utilisent bien et ceux qui ne l'utilisent pas se creuse, et c'est suffisamment documenté pour le prendre au sérieux.",
            "Cela dit, bien l'utiliser suppose de comprendre ce qu'elle fait réellement. Les modèles ne « savent » pas les choses au sens propre : ils récupèrent et génèrent à partir de patterns statistiques. Le concept de RAG le rend concret : le modèle va chercher du contexte pertinent et génère à partir de là. Une fois qu'on a compris ce mécanisme, on formule ses requêtes différemment et on arrête de traiter le résultat comme une vérité.",
            "Je l'ai observé directement avec un camarade qui avait rendu du code généré par IA sans le relire. Il y avait une faille de sécurité dedans. Le modèle n'était pas en cause : la consigne était mal formulée et il n'y avait aucune étape de validation. L'IA a produit exactement ce qu'on lui demandait. L'erreur était de l'utiliser comme substitut à la compréhension plutôt que comme complément.",
            "Le coût environnemental mérite aussi d'être mentionné clairement. Entraîner de grands modèles est énergivore, et l'inférence à grande échelle s'accumule de façon significative. Ce n'est pas un argument contre l'IA, mais c'est un argument pour être délibéré : choisir la taille de modèle adaptée à la tâche, éviter les appels inutiles, et privilégier une infrastructure alimentée par des énergies plus propres. Des arbitrages d'ingénierie comme les autres.",
            "Ce qui est moins souvent discuté : ce que ça fait à l'environnement informationnel quand produire du contenu devient quasiment gratuit. Les résultats de recherche se remplissent déjà de texte généré de mauvaise qualité, et il devient plus difficile de trouver du travail réellement écrit par quelqu'un. Par ailleurs, les personnes dont le travail a servi à entraîner ces modèles, écrivains, illustrateurs, musiciens, se retrouvent en concurrence avec des sorties construites sur leur propre travail, à une échelle qu'ils ne peuvent pas suivre. Ce ne sont pas des risques hypothétiques. Ils sont déjà mesurables.",
        ],
    },
};

const sectionStyle: React.CSSProperties = {
    marginBottom: 36,
};

const h2Style: React.CSSProperties = {
    color: "#a855f7",
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 16,
    marginTop: 0,
};

const pStyle: React.CSSProperties = {
    lineHeight: 1.85,
    maxWidth: 660,
    color: "#bbb",
    marginBottom: 16,
    marginTop: 0,
};

export default function AIViews() {
    const { lang } = useLang();
    const c = T[lang as keyof typeof T] ?? T.en;

    return (
        <div
            style={{
                background: "#0d0d1a",
                color: "#ddd",
                minHeight: "100vh",
                padding: "48px 40px",
                fontFamily: "sans-serif",
                boxSizing: "border-box",
            }}
        >
            <h1
                style={{
                    color: "#a855f7",
                    marginTop: 0,
                    marginBottom: 8,
                    fontSize: 30,
                }}
            >
                {c.title}
            </h1>
            <div
                style={{
                    width: 48,
                    height: 3,
                    background: "#a855f7",
                    borderRadius: 2,
                    marginBottom: 40,
                    opacity: 0.7,
                }}
            />

            <div style={sectionStyle}>
                <h2 style={h2Style}>{c.sub1}</h2>
                {c.body1.map((p, i) => (
                    <p key={i} style={pStyle}>
                        {p}
                    </p>
                ))}
            </div>

            <hr
                style={{
                    border: "none",
                    borderTop: "1px solid rgba(168,85,247,0.15)",
                    margin: "32px 0",
                }}
            />

            <div style={sectionStyle}>
                <h2 style={h2Style}>{c.sub2}</h2>
                {c.body2.map((p, i) => (
                    <p key={i} style={pStyle}>
                        {p}
                    </p>
                ))}
            </div>

            <hr
                style={{
                    border: "none",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    margin: "32px 0",
                }}
            />
            <p style={{ color: "#555", fontSize: 13 }}>
                ← Close the panel to return to the 3D scene.
            </p>
        </div>
    );
}
