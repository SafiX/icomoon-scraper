const appRoot = require('app-root-path');
const getIcomoonZip = require(appRoot + '/src/scraper.js');
const utils = require(appRoot + '/src/utils.js');
const paths = require(appRoot + '/src/paths.js');
const compare = require(appRoot + '/src/compare.js');
const github = require(appRoot + '/src/github.js');
const buildEssentials = require(appRoot + '/src/buildEssentials.js');
const utilServer = require(appRoot + '/src/utilServer.js');

const log = utils.log;
const extractIcomoonZip = compare.extractIcomoonZip;
const cloneEssentialsRepo = github.cloneEssentialsRepo;
const checkForChangesInIcons = compare.checkForChangesInIcons;
const commitAndPush = github.commitAndPush;
const stageFiles = github.stageFiles;
const commitEssentialsDist = github.commitEssentialsDist;

utilServer
	.then(getIcomoonZip)
	.then(extractIcomoonZip)
	.then(cloneEssentialsRepo)
	.then(checkForChangesInIcons)

	.then(changedFiles => {
		if (changedFiles.length > 0) {
			return stageFiles(changedFiles)
				.then(() => "Automoon - icons updated")
				.then(commitAndPush)
				.then(buildEssentials)
				.then(commitEssentialsDist)
				.then(() => log("success :)"))
		} else {
			log('Nothing to commit');
		}
	})
	.catch(err => log(err));
