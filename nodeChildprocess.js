const { spawn } = require('child_process');

let childProcessOutput = '', childProcess = null;

function subscribe() {
    childProcess.stdout.on('data', (chunk) => {
        childProcessOutput += chunk.toString('utf-8');
    });
    childProcess.stdout.on('end', () => {
        console.log(childProcessOutput);
    });
}

function makeNodeChildProcess(argumentsPassedByUser, absolutePathToFile) {
    if(childProcess) {
        childProcess.kill();
        childProcessOutput = '';
    }
    childProcess = spawn('node', [absolutePathToFile,...argumentsPassedByUser]);
    subscribe();
}

module.exports = {makeNodeChildProcess};