import fs from "fs";
import path from "path";
import dotenvFlow from "dotenv-flow";

export function init() {
    console.log("👋 Hello");

    function findEnvDirectory(startDir: string) {
        let currentDir = startDir;

        while (true) {
            const envFilePath = path.join(currentDir, ".env");

            if (fs.existsSync(envFilePath)) {
                return currentDir;
            }

            const parentDir = path.resolve(currentDir, "..");

            if (parentDir === currentDir) {
                break;
            }

            currentDir = parentDir;
        }

        return null;
    }

    const envDirectory = findEnvDirectory(__dirname);

    if (envDirectory) {
        console.log(`Loading .env files from directory: ${envDirectory}`);

        dotenvFlow.config({
            path: envDirectory,
        });
    } else {
        console.error("No .env file found.");
        process.exit(1);
    }
}
