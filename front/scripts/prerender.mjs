import fs   from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir   = path.resolve(__dirname, "../dist");

// Minimal browser-global stubs so LangContext (localStorage) doesn't crash
global.localStorage   = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
global.sessionStorage = global.localStorage;

const ROUTES = [
    "/quick-resume",
    "/about", "/skills", "/soft-skills", "/contact",
    "/ai-views", "/hobbies", "/sports", "/reading",
    "/projects/nlu", "/projects/cybersec",
    "/projects/portfolio", "/projects/game-3d",
    "/projects/dominion", "/projects/eco-app",
    "/experience/visc", "/experience/pyralis",
    "/education/polytech", "/education/toeic",
    "/info",
];

async function main() {
    const { render } = await import("../dist/server/entry-server.js");
    const template   = fs.readFileSync(path.join(distDir, "index.html"), "utf-8");

    for (const route of ROUTES) {
        const appHtml = render(route);
        const html    = template.replace(
            '<div id="root"></div>',
            `<div id="root">${appHtml}</div>`,
        );

        const filePath = path.join(distDir, route, "index.html");
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, html);
        console.log(`  ✓ ${route}`);
    }

    console.log(`\nPrerendered ${ROUTES.length} routes.`);
}

main().catch(e => { console.error(e); process.exit(1); });
