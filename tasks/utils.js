const fs = require("node:fs/promises");
const path = require("node:path");

async function listFiles(directory) {
    let entries;

    try {
        entries = await fs.readdir(directory, { withFileTypes: true });
    } catch (error) {
        if (error.code === "ENOENT") return [];
        throw error;
    }

    const files = [];
    for (const entry of entries) {
        const entryPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            files.push(...(await listFiles(entryPath)));
        } else if (entry.isFile() && entry.name !== ".gitkeep") {
            files.push(entryPath);
        }
    }

    return files.sort();
}

module.exports = { listFiles };
