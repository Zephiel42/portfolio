import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

const ROUTES = [
    "/",
    "/quick-resume",
    "/about", "/skills", "/soft-skills", "/contact",
    "/ai-views", "/hobbies", "/sports", "/reading",
    "/projects", "/projects/nlu", "/projects/cybersec",
    "/projects/portfolio", "/projects/game-3d",
    "/projects/dominion", "/projects/eco-app",
    "/experience/visc", "/experience/pyralis",
    "/education/polytech", "/education/toeic",
];

function generateSeoFiles(siteUrl: string) {
    return {
        name: "generate-seo-files",
        apply: "build" as const,
        closeBundle() {
            const outDir = path.resolve("dist");
            fs.mkdirSync(outDir, { recursive: true });

            const urls = ROUTES.map(r =>
                `  <url><loc>${siteUrl}${r}</loc></url>`
            ).join("\n");
            fs.writeFileSync(
                path.join(outDir, "sitemap.xml"),
                `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
            );

            fs.writeFileSync(
                path.join(outDir, "robots.txt"),
                `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
            );
        },
    };
}

// Vite copies public/ to dist/ AFTER writing the built index.html, which
// would overwrite it with the plain public/index.html placeholder.
// This plugin disables the built-in copy and handles it manually,
// skipping public/index.html so the built one is preserved.
function copyPublicExceptIndex() {
    return {
        name: "copy-public-except-index",
        apply: "build" as const,
        closeBundle() {
            const publicDir = path.resolve("public");
            const outDir = path.resolve("dist");
            if (!fs.existsSync(publicDir)) return;

            function copyDir(src: string, dest: string) {
                fs.mkdirSync(dest, { recursive: true });
                for (const item of fs.readdirSync(src)) {
                    if (src === publicDir && (item === "index.html" || item === "sitemap.xml" || item === "robots.txt")) continue;
                    const srcPath = path.join(src, item);
                    const destPath = path.join(dest, item);
                    if (fs.statSync(srcPath).isDirectory()) {
                        copyDir(srcPath, destPath);
                    } else {
                        fs.copyFileSync(srcPath, destPath);
                    }
                }
            }
            copyDir(publicDir, outDir);
        },
    };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    const siteUrl = env.VITE_SITE_URL ?? "https://matys.grangaud.tech";
    return {
        plugins: [react(), copyPublicExceptIndex(), generateSeoFiles(siteUrl)],
        resolve: {
            alias: { src: path.resolve("src") },
        },
        build: {
            outDir: "dist",
            copyPublicDir: false,
        },
        server: {
            port: 3000,
        },
    };
});
