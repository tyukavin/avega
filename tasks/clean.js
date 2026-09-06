const fs = require("node:fs/promises");

async function clean() {
    await Promise.all([
        fs.rm("build", { recursive: true, force: true }),
        fs.rm(".cache", { recursive: true, force: true }),
    ]);
    await fs.mkdir("build", { recursive: true });
    await fs.writeFile("build/.gitkeep", "");
}

module.exports = { clean };
