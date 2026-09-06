const browserSync = require("browser-sync").create();

function commonOptions() {
    return {
        browser: "default",
        listen: process.env.DEV_LISTEN || "localhost",
        logConnections: true,
        logFileChanges: true,
        open: process.env.BROWSER_SYNC_OPEN !== "false",
    };
}

function serveHtml(done) {
    browserSync.init(
        {
            ...commonOptions(),
            logPrefix: "HTML",
            server: { baseDir: "build" },
        },
        done,
    );
}

function servePhp(done) {
    if (!process.env.PHP_PROXY) {
        done(
            new Error(
                "Set PHP_PROXY, for example PHP_PROXY=http://project.test",
            ),
        );
        return;
    }

    browserSync.init(
        {
            ...commonOptions(),
            logPrefix: "PHP",
            proxy: process.env.PHP_PROXY,
        },
        done,
    );
}

module.exports = { browserSync, serveHtml, servePhp };
