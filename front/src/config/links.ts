// ── Personal links *────────────────────────────────────

export const EMAIL = "matys@grangaud.org";
export const LINKEDIN = "https://linkedin.com/in/matys-grangaud-4200tech";
export const GITHUB = "https://github.com/Zephiel42";

// Project repos
export const GITHUB_PORTFOLIO = "https://github.com/Zephiel42/portfolio";
export const GITHUB_ECOAPP = "https://github.com/Remigius2003/gl26_ecohome";

/** Flat list used by QuickResume header */
export const CONTACT_LINKS = [
    { label: EMAIL, href: `mailto:${EMAIL}` },
    { label: "linkedin.com/in/matys-grangaud", href: LINKEDIN },
    { label: "github.com/Zephiel42", href: GITHUB },
];

/** Rich list used by the Contact page */
export const CONTACT_CARDS = [
    {
        icon: "@",
        label: "Email",
        value: EMAIL,
        href: `mailto:${EMAIL}`,
        color: "#06d6a0",
        bg: "rgba(6,214,160,0.10)",
        border: "rgba(6,214,160,0.35)",
        key: "email" as const,
    },
    {
        icon: "in",
        label: "LinkedIn",
        value: "linkedin.com/in/matys-grangaud",
        href: LINKEDIN,
        color: "#0a66c2",
        bg: "rgba(10,102,194,0.12)",
        border: "rgba(10,102,194,0.35)",
        key: "linkedin" as const,
    },
    {
        icon: "⌥",
        label: "GitHub",
        value: "github.com/Zephiel42",
        href: GITHUB,
        color: "#e6edf3",
        bg: "rgba(255,255,255,0.06)",
        border: "rgba(255,255,255,0.12)",
        key: "github" as const,
    },
];
