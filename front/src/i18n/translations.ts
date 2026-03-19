export type Lang = "en" | "fr";

export interface CardTranslation { label: string; description: string; }

export interface Translations {
    faces:    Record<"right" | "left" | "top" | "bottom" | "front" | "back", string>;
    labels:   Record<string, string>;
    subtitles: Record<string, string>;
    ui: {
        view:           string;
        tooFar:         string;
        pathBlocked:    string;
        interactedWith: string;
        loadError:      string;
        hintExplore:    string;
        hintGame:       string;
        quickResume:    string;
    };
    game: {
        chooseCard: string;
        paused:     string;
        cards: Record<string, CardTranslation>;
    };
}

export const translations: Record<Lang, Translations> = {
    en: {
        labels: {
            "Lectures":    "Reading",
            "IA":          "AI",
            "Éco App":     "Eco App",
            "Jeu 3D":      "3D Game",
            "Audit Cyber": "Cyber Audit",
        },
        subtitles: {
            "about me": "about me",
            "views":    "views",
            "play":     "play",
            "links":    "links",
            "books":    "books",
            "loisirs":  "hobbies",
        },
        faces: {
            front:  "Profile",
            left:   "Experience",
            top:    "Education",
            bottom: "Skills",
            right:  "Projects",
            back:   "Mini Game",
        },
        ui: {
            view:           "View",
            tooFar:         "Too far to interact",
            pathBlocked:    "Path blocked!",
            interactedWith: "Interacted with",
            loadError:      "Could not load objects from server",
            hintExplore:    "🖱 Drag to pan  |  Scroll to zoom  |  Click ground to jump  |  Walk into gold boxes to get cards",
            hintGame:       "🖱 Click ground to jump  |  Click Start Game to play  |  Walk into gold boxes to pick cards",
            quickResume:    "Quick Resume",
        },
        game: {
            chooseCard: "Choose a card",
            paused:     "Game paused",
            cards: {
                temp:            { label: "Meteor Storm",    description: "Meteors rain from the sky and crush everything below" },
                buff_orbit:      { label: "Orbital Shield",  description: "Projectiles orbit you and damage any enemy they touch" },
                buff_auto:       { label: "Auto-Cannon",     description: "Automatically fires at the nearest enemy" },
                building_turret: { label: "Deploy Turret",   description: "Place a turret with its own HP that fights independently" },
                upgrade_orbit:   { label: "Orbital+",        description: "+1 orbit projectile and faster rotation" },
                upgrade_auto:    { label: "Auto-Cannon+",    description: "Fire twice as fast with increased damage" },
                upgrade_turret:  { label: "Turret+",         description: "Fully repair and upgrade your turret's fire rate" },
            },
        },
    },
    fr: {
        labels: {
            "Skills":      "Compétences",
            "Soft Skills": "Savoir-être",
            "About":       "À propos",
            "Start Game":  "Jouer",
            "Lectures":    "Lectures",
            "Hobbies":     "Loisirs",
        },
        subtitles: {
            "about me": "à propos",
            "views":    "avis",
            "play":     "jouer",
            "links":    "liens",
            "books":    "livres",
            "loisirs":  "loisirs",
        },
        faces: {
            front:  "Profil",
            left:   "Expérience",
            top:    "Formation",
            bottom: "Compétences",
            right:  "Projets",
            back:   "Mini Jeu",
        },
        ui: {
            view:           "Vue",
            tooFar:         "Trop loin pour interagir",
            pathBlocked:    "Chemin bloqué !",
            interactedWith: "Interaction avec",
            loadError:      "Impossible de charger les objets",
            hintExplore:    "🖱 Glisser pour déplacer  |  Molette pour zoomer  |  Clic sol pour sauter  |  Marcher sur les coffres dorés pour des cartes",
            hintGame:       "🖱 Clic sol pour sauter  |  Clic Start Game pour jouer  |  Marcher sur les coffres dorés pour des cartes",
            quickResume:    "Résumé rapide",
        },
        game: {
            chooseCard: "Choisissez une carte",
            paused:     "Jeu en pause",
            cards: {
                temp:            { label: "Pluie de météores", description: "Des météores s'écrasent sur la carte et dévastent les ennemis" },
                buff_orbit:      { label: "Bouclier orbital",  description: "Des projectiles orbitent autour de vous et blessent les ennemis au contact" },
                buff_auto:       { label: "Canon automatique", description: "Tire automatiquement sur l'ennemi le plus proche" },
                building_turret: { label: "Déployer tourelle", description: "Place une tourelle avec ses propres PV qui combat de façon autonome" },
                upgrade_orbit:   { label: "Orbital+",          description: "+1 projectile orbital et rotation plus rapide" },
                upgrade_auto:    { label: "Canon auto+",       description: "Cadence doublée et dégâts augmentés" },
                upgrade_turret:  { label: "Tourelle+",         description: "Répare entièrement et améliore la cadence de la tourelle" },
            },
        },
    },
};
