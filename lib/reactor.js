const path = require('path');
const spawn = require('cross-spawn');

exports.generate = function (projectDir) {
    return new Promise((resolve, reject) => {
        const command = 'node';
        const args = [path.join(__dirname, "../node_modules", 'create-react-app'), projectDir];

        const child = spawn(command, args, { stdio: 'inherit' });
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
};
