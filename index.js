const process = require('process');
const path = require('path');
const { watch } = require('fs/promises');
const {makeNodeChildProcess} = require('./nodeChildprocess'); 
const logger = require('./logger');

const filePathPassedByUser = process.argv[2];
const argumentsPassedByUser = process.argv.slice(2);
const absolutePathToFile = path.resolve(__dirname,filePathPassedByUser);
const directoryOfFile = path.parse(absolutePathToFile).dir;

(async () => {
    const changesIterable = watch(directoryOfFile);
    makeNodeChildProcess(argumentsPassedByUser, absolutePathToFile);
    logger('processStarted');
    for await (let info of changesIterable) {
        if (info.eventType === 'change' && Object.hasOwnProperty.call(info, 'filename')) {
            makeNodeChildProcess(argumentsPassedByUser, absolutePathToFile);
            logger('processRestarted');
        }
    }
})();
