function logger(type) {
    if(type === 'processStarted') {
        console.log('started node process...');
    } else if (type === 'processRestarted') {
        console.log('restarted node process...');
    }
}

module.exports = logger;