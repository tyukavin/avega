const { dest, src } = require("gulp");
const include = require("gulp-file-include");
const { browserSync } = require("./server");

function php() {
    return src("src/**/*.php", { allowEmpty: true })
        .pipe(include({ indent: true }))
        .pipe(dest("build"))
        .pipe(browserSync.stream());
}

module.exports = { php };
