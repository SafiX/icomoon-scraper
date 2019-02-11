const fs = require('fs');
const fsExtra = require('fs-extra');
const appRoot = require('app-root-path');

const paths = require(appRoot + '/src/paths.js');
const utils = require(appRoot + '/src/utils.js');
const gitHub = require(appRoot + '/src/github.js');

const log = utils.log;

let extractIcomoonZip = () => {
	if (!fs.existsSync(paths.latestDirectory + paths.iconsFileName)) {
		throw 'There is no icons zip files :'
	}
	return utils.extractZip(paths.latestDirectory + paths.iconsFileName, paths.extractedDirectory);
};

let checkForChangesInIcons = () => {
	// write files from icomoon to essentials local cloned repo
	paths.filesToCompareAndCommit.forEach(file => {
		let icomoonFileContent = fs.readFileSync(file.icomoonFile);
		fs.writeFileSync(file.essentialsFile, icomoonFileContent, {flag: 'w'});
	});

	return gitHub.checkForChanges()
};



module.exports = {
	extractIcomoonZip,
	checkForChangesInIcons
};