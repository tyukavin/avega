const path = require("node:path");
const esbuild = require("esbuild");
const { browserSync } = require("./server");

async function bundle({ minify }) {
    await esbuild.build({
        bundle: true,
        entryPoints: ["src/js/01_main.js"],
        format: "iife",
        legalComments: "none",
        minify,
        outfile: "build/js/main.min.js",
        platform: "browser",
        sourcemap: true,
        target: ["es2020"],
    });

    browserSync.reload(path.resolve("build/js/main.min.js"));
}

function scriptsDevelopment() {
    return bundle({ minify: false });
}

function scriptsProduction() {
    return bundle({ minify: true });
}

module.exports = { scriptsDevelopment, scriptsProduction };
