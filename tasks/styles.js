const fs = require("node:fs/promises");
const path = require("node:path");
const autoprefixer = require("autoprefixer");
const postcss = require("postcss");
const sass = require("sass");
const { browserSync } = require("./server");

const ENTRY = path.resolve("src/scss/style.scss");
const CSS_OUTPUT = path.resolve("build/css/style.css");
const MAP_OUTPUT = path.resolve("build/sourcemaps/style.css.map");

async function compile({ compressed }) {
    const sassResult = await sass.compileAsync(ENTRY, {
        sourceMap: true,
        sourceMapIncludeSources: true,
        style: compressed ? "compressed" : "expanded",
    });

    const result = await postcss([autoprefixer()]).process(sassResult.css, {
        from: ENTRY,
        map: {
            annotation: "../sourcemaps/style.css.map",
            inline: false,
            prev: sassResult.sourceMap,
            sourcesContent: true,
        },
        to: CSS_OUTPUT,
    });

    await Promise.all([
        fs.mkdir(path.dirname(CSS_OUTPUT), { recursive: true }),
        fs.mkdir(path.dirname(MAP_OUTPUT), { recursive: true }),
    ]);
    await Promise.all([
        fs.writeFile(CSS_OUTPUT, result.css),
        fs.writeFile(MAP_OUTPUT, result.map.toString()),
    ]);

    browserSync.reload(CSS_OUTPUT);
}

function stylesDevelopment() {
    return compile({ compressed: false });
}

function stylesProduction() {
    return compile({ compressed: true });
}

module.exports = { stylesDevelopment, stylesProduction };
