const process = require('process');
const { spawn } = require('child_process');
const path = require('path');
const { watch } = require('fs/promises');

const file = process.argv[2];
const absolutePathToFile = path.resolve(file);
const directoryOfFile = path.parse(absolutePathToFile).dir;

function initChildProcess() {
    console.log('started node process...');
    let childProcessOutput = '';
    let childProcess = spawn('node', [absolutePathToFile]);
    function subscribe() {
        childProcess.stdout.on('data', (chunk) => {
            childProcessOutput += chunk.toString('utf-8');
        });
        childProcess.stdout.on('end', (chunk) => {
            console.log(childProcessOutput);
        });
    }
    subscribe();
    return {
        remakeChildProcess: function () {
            console.log('restarted node process...');
            childProcess.kill();
            childProcessOutput = '';
            childProcess = spawn('node', [absolutePathToFile]);
            subscribe();
        }
    }
}

(async () => {
    const changesIterable = watch(directoryOfFile);
    const { remakeChildProcess } = initChildProcess();
    for await (let info of changesIterable) {
        if (info.eventType === 'change' && Object.hasOwnProperty.call(info, 'filename')) {
            remakeChildProcess();
        }
    }
})();
