const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");
const { optimize } = require("svgo");
const { browserSync } = require("./server");
const { listFiles } = require("./utils");

const SOURCE = path.resolve("src/img");
const DESTINATION = path.resolve("build/img");

async function writeRaster(sourcePath, outputPath, extension) {
    const image = sharp(sourcePath, {
        animated: extension === ".gif",
    }).rotate();

    if (extension === ".png") {
        await image.clone().png({ compressionLevel: 9 }).toFile(outputPath);
    } else {
        await image
            .clone()
            .jpeg({ mozjpeg: true, quality: 82 })
            .toFile(outputPath);
    }

    const basename = outputPath.slice(0, -extension.length);
    await Promise.all([
        image.clone().webp({ quality: 80 }).toFile(`${basename}.webp`),
        image.clone().avif({ quality: 50 }).toFile(`${basename}.avif`),
    ]);
}

async function images() {
    await fs.mkdir(DESTINATION, { recursive: true });
    const expectedOutputs = new Set();

    for (const sourcePath of await listFiles(SOURCE)) {
        const relativePath = path.relative(SOURCE, sourcePath);
        const outputPath = path.join(DESTINATION, relativePath);
        const extension = path.extname(sourcePath).toLowerCase();
        await fs.mkdir(path.dirname(outputPath), { recursive: true });

        if (
            extension === ".png" ||
            extension === ".jpg" ||
            extension === ".jpeg"
        ) {
            const basename = relativePath.slice(0, -extension.length);
            expectedOutputs.add(relativePath);
            expectedOutputs.add(`${basename}.webp`);
            expectedOutputs.add(`${basename}.avif`);
            await writeRaster(sourcePath, outputPath, extension);
        } else if (extension === ".svg") {
            expectedOutputs.add(relativePath);
            const result = optimize(await fs.readFile(sourcePath, "utf8"), {
                path: sourcePath,
            });
            await fs.writeFile(outputPath, result.data);
        } else {
            expectedOutputs.add(relativePath);
            await fs.copyFile(sourcePath, outputPath);
        }
    }

    for (const outputPath of await listFiles(DESTINATION)) {
        const relativePath = path.relative(DESTINATION, outputPath);
        if (
            relativePath !== "sprite.svg" &&
            !expectedOutputs.has(relativePath)
        ) {
            await fs.rm(outputPath, { force: true });
        }
    }

    browserSync.reload();
}

module.exports = { images };
