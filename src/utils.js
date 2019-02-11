const EventEmitter = require('events');
const appRoot = require('app-root-path');
const paths = require(appRoot + '/src/paths.js');
const fs = require('fs');
const extract = require('extract-zip');

const emtr = new EventEmitter();

let constants = {
	DEPLOY_STATE: {
		IN_PROGRESS: 'in_progress',
		IDLE: 'idle'
	}
};

module.exports = {
	createDirectory: arrOfPaths => {
		arrOfPaths.forEach(path => {
			if (!fs.existsSync(path)) {
				fs.mkdirSync(path);
			}
		})
	},
	log: msg => {
		// TODO see if in debug mode or not based on process arguments
		console.log(msg);
		emtr.emit('log', msg);
	},
	extractZip: (source, target) => new Promise(((resolve, reject) => {
		extract(source, {dir: target}, err => {
			if (err) {
				reject(err);
			} else {
				console.log('Extract complete');
				resolve();
			}
		})
	})),
	setState: (state) => {
		if (global.state !== state) {
			global.state = state;
      emtr.emit('state_change', state);
    }
	},
	getConfig: () => fs.readFileSync(paths.configPath),
	constants: constants,
	emtr: emtr
};
