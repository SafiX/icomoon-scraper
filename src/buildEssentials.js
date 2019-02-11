const shell = require('shelljs');

const appRoot = require('app-root-path');
const paths = require(appRoot + '/src/paths.js');
const utils = require(appRoot + '/src/utils.js');

const log = utils.log;


let npmInstall =  () => new Promise((resolve, reject) => {
		shell.cd(paths.essentialsLocalPath);
		log("Running npm install in essentials working directory");
		shell.exec('npm i', {silent: true}, (code, stdout, stderr) => {
			if (code !== 0) {
				log("Error running npm install in Essentials folder");
				return reject({code, stdout, stderr})
			}
			return resolve()

		});
	});

let runGulp = () => new Promise((resolve, reject) => {
	shell.exec('gulp build', {silent: true}, (code, stdout, stderr) => {
		log("Running gulp build in essentials working directory");
		if (code !== 0) {
			log("Error running gulp build in essentials folder");
			return reject({code, stdout, stderr})
		}
		return resolve()

	});
});

module.exports = () => npmInstall().then(runGulp);
