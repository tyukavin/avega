const fs = require("node:fs/promises");
const path = require("node:path");
const wawoff2 = require("wawoff2");
const { browserSync } = require("./server");
const { listFiles } = require("./utils");

const SOURCE = path.resolve("src/fonts");
const DESTINATION = path.resolve("build/fonts");

async function fonts() {
    await fs.rm(DESTINATION, { recursive: true, force: true });
    await fs.mkdir(DESTINATION, { recursive: true });

    for (const sourcePath of await listFiles(SOURCE)) {
        const relativePath = path.relative(SOURCE, sourcePath);
        const extension = path.extname(sourcePath).toLowerCase();

        if (extension === ".ttf") {
            const outputPath = path.join(
                DESTINATION,
                relativePath.slice(0, -extension.length) + ".woff2",
            );
            await fs.mkdir(path.dirname(outputPath), { recursive: true });
            const converted = await wawoff2.compress(
                await fs.readFile(sourcePath),
            );
            await fs.writeFile(outputPath, converted);
        } else if (extension === ".woff" || extension === ".woff2") {
            const outputPath = path.join(DESTINATION, relativePath);
            await fs.mkdir(path.dirname(outputPath), { recursive: true });
            await fs.copyFile(sourcePath, outputPath);
        }
    }

    browserSync.reload();
}

module.exports = { fonts };
