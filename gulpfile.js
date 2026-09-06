const { parallel, series, watch } = require("gulp");

const { clean } = require("./tasks/clean");
const { deploy } = require("./tasks/deploy");
const { fonts } = require("./tasks/fonts");
const { html } = require("./tasks/html");
const { images } = require("./tasks/images");
const { php } = require("./tasks/php");
const { scriptsDevelopment, scriptsProduction } = require("./tasks/scripts");
const { serveHtml, servePhp } = require("./tasks/server");
const { sprite } = require("./tasks/sprite");
const { stylesDevelopment, stylesProduction } = require("./tasks/styles");
const { svgCss } = require("./tasks/svg-css");

const markup = parallel(html, php);
const staticAssets = series(images, sprite);
const stylesDev = series(svgCss, stylesDevelopment);
const stylesBuild = series(svgCss, stylesProduction);

const compileDevelopment = parallel(
    markup,
    staticAssets,
    fonts,
    scriptsDevelopment,
    stylesDev,
);

const compileProduction = parallel(
    markup,
    staticAssets,
    fonts,
    scriptsProduction,
    stylesBuild,
);

function watchFiles() {
    watch(["src/**/*.html", "src/**/*.json"], html);
    watch("src/**/*.php", php);
    watch(
        ["src/scss/**/*.scss", "src/components/**/*.scss"],
        stylesDevelopment,
    );
    watch("src/js/**/*.js", scriptsDevelopment);
    watch("src/img/**/*", images);
    watch("src/svg/css/**/*.svg", stylesDev);
    watch("src/svg/sprite/**/*.svg", sprite);
    watch("src/fonts/**/*", fonts);
}

const build = series(clean, compileProduction);
const dev = series(clean, compileDevelopment, parallel(serveHtml, watchFiles));
const devPhp = series(
    clean,
    compileDevelopment,
    parallel(servePhp, watchFiles),
);

exports.clean = clean;
exports.build = build;
exports.dev = dev;
exports["dev:php"] = devPhp;
exports.deploy = series(build, deploy);
exports.default = dev;
