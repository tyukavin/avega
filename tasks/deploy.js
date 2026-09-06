const fs = require("node:fs/promises");
const path = require("node:path");
const SftpClient = require("ssh2-sftp-client");

async function deploy() {
    const {
        SFTP_HOST,
        SFTP_PORT,
        SFTP_USER,
        SFTP_PASSWORD,
        SFTP_KEY,
        SFTP_PATH,
    } = process.env;

    if (!SFTP_HOST || !SFTP_USER || (!SFTP_PASSWORD && !SFTP_KEY)) {
        throw new Error(
            "Set SFTP_HOST, SFTP_USER and either SFTP_PASSWORD or SFTP_KEY before deploy.",
        );
    }

    const client = new SftpClient("web-startpack");
    const remotePath = SFTP_PATH || "/public_html";
    const config = {
        host: SFTP_HOST,
        port: Number(SFTP_PORT || 22),
        username: SFTP_USER,
    };

    if (SFTP_KEY) {
        config.privateKey = await fs.readFile(path.resolve(SFTP_KEY));
    } else {
        config.password = SFTP_PASSWORD;
    }

    try {
        await client.connect(config);
        await client.mkdir(remotePath, true);
        await client.uploadDir(path.resolve("build"), remotePath);
    } finally {
        await client.end().catch(() => {});
    }
}

module.exports = { deploy };
