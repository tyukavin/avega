const fs = require("node:fs/promises");
const path = require("node:path");
const { optimize } = require("svgo");
const { browserSync } = require("./server");
const { listFiles } = require("./utils");

const SOURCE = path.resolve("src/svg/sprite");
const OUTPUT = path.resolve("build/img/sprite.svg");

function symbolId(sourcePath) {
    return path
        .relative(SOURCE, sourcePath)
        .slice(0, -path.extname(sourcePath).length)
        .replace(/[^a-zA-Z0-9_-]+/g, "-");
}

function toSymbol(sourcePath, svg) {
    const match = svg.match(/^<svg\b([^>]*)>([\s\S]*)<\/svg>$/i);
    if (!match) throw new Error(`Invalid SVG: ${sourcePath}`);

    const attributes = match[1]
        .replace(/\s+xmlns(?::\w+)?=(['"])[\s\S]*?\1/gi, "")
        .replace(/\s+(?:id|width|height)=(['"])[\s\S]*?\1/gi, "");

    return `<symbol id="${symbolId(sourcePath)}"${attributes}>${match[2]}</symbol>`;
}

async function sprite() {
    const symbols = [];

    for (const sourcePath of await listFiles(SOURCE)) {
        if (path.extname(sourcePath).toLowerCase() !== ".svg") continue;
        const result = optimize(await fs.readFile(sourcePath, "utf8"), {
            path: sourcePath,
        });
        symbols.push(toSymbol(sourcePath, result.data));
    }

    await fs.mkdir(path.dirname(OUTPUT), { recursive: true });
    if (symbols.length === 0) {
        await fs.rm(OUTPUT, { force: true });
    } else {
        await fs.writeFile(
            OUTPUT,
            `<svg xmlns="http://www.w3.org/2000/svg">${symbols.join("")}</svg>`,
        );
    }

    browserSync.reload();
}

module.exports = { sprite };
