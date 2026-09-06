const fs = require("node:fs/promises");
const path = require("node:path");
const { optimize } = require("svgo");
const { listFiles } = require("./utils");

const SOURCE = path.resolve("src/svg/css");
const OUTPUT = path.resolve(".cache/_svg.scss");

function dataUri(svg) {
    return svg
        .replace(/\s+/g, " ")
        .replace(/"/g, "'")
        .replace(/%/g, "%25")
        .replace(/#/g, "%23")
        .replace(/{/g, "%7B")
        .replace(/}/g, "%7D")
        .replace(/</g, "%3C")
        .replace(/>/g, "%3E");
}

async function svgCss() {
    const rules = [];

    for (const sourcePath of await listFiles(SOURCE)) {
        if (path.extname(sourcePath).toLowerCase() !== ".svg") continue;
        const name = path
            .basename(sourcePath, ".svg")
            .replace(/[^a-zA-Z0-9_-]/g, "-");
        const result = optimize(await fs.readFile(sourcePath, "utf8"), {
            path: sourcePath,
        });
        rules.push(
            `.--svg__${name} {\n  background-image: url("data:image/svg+xml,${dataUri(result.data)}");\n}`,
        );
    }

    await fs.mkdir(path.dirname(OUTPUT), { recursive: true });
    await fs.writeFile(OUTPUT, `${rules.join("\n\n")}\n`);
}

module.exports = { svgCss };
