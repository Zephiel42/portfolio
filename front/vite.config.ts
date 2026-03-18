import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

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
                    if (src === publicDir && item === "index.html") continue;
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

export default defineConfig({
    plugins: [react(), copyPublicExceptIndex()],
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
});
