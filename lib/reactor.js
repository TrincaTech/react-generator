const path = require('path');
const fs = require("fs").promises;
const spawn = require('cross-spawn');
const editJsonFile = require("edit-json-file");

exports.generate = async function (projectDir) {
    await create(projectDir);
    process.chdir(projectDir);
    await addEsLint();
    await addCssLint();
};

async function create(projectDir) {
    const command = 'node';
    const args = [path.resolve(__dirname, "../node_modules/create-react-app"), projectDir];
    return spawnAsync(command, args);
}

async function addEsLint() {
    const fileName = ".eslintrc";
    await fs.copyFile(path.resolve(__dirname, fileName), fileName);

    const pack = editJsonFile("package.json");
    pack.set("lint-staged", {
        "src/**/*.{js,json}": [
            "eslint --fix",
            "git add",
        ],
    });
    pack.set("scripts.precommit", "lint-staged");
    pack.save();

    const command = "yarn";
    const args = ["add", "eslint-plugin-import", "husky", "lint-staged", "-D"];
    await spawnAsync(command, args);

    return spawnAsync("yarn", ["eslint", "--fix", "src/", "--ext", ".js"]);
}

async function addCssLint() {
    const fileName = ".stylelintrc";
    await fs.copyFile(path.resolve(__dirname, fileName), fileName);

    const pack = editJsonFile("package.json");
    pack.set("lint-staged.src/**/*\\.css", [
        "stylelint --fix",
        "git add",
    ]);
    pack.save();

    const command = "yarn";
    const args = ["add", "stylelint", "stylelint-config-standard", "-D"];
    await spawnAsync(command, args);

    return spawnAsync("yarn", ["stylelint", "--fix", "src/**/*.css"]);
}

async function spawnAsync(command, args, options = { stdio: 'inherit' }) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, options);
        child.on('close', code => {
            if (code !== 0) {
                reject({
                    command: `${command} ${args.join(' ')}`,
                });
                return;
            }
            resolve();
        });
    });
}
