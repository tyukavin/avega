const { dest, src } = require("gulp");
const include = require("gulp-file-include");
const { browserSync } = require("./server");

function html() {
    return src(["src/**/*.html", "!src/components/**/*.html"])
        .pipe(include({ indent: true }))
        .pipe(dest("build"))
        .pipe(browserSync.stream());
}

module.exports = { html };
