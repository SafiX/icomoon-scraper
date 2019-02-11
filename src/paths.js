const appRoot = require('app-root-path');

const workingDirectory = appRoot + '/working-directory';
const src = appRoot + '/src/';
const scrapeFilesPath = workingDirectory + '/zip_files';
const extractedDirectory = workingDirectory + '/extracted-zip/';
const essentialsLocalPath = workingDirectory + '/jfrog-ui-essentials';
const essentialsAssetPath = essentialsLocalPath + '/src/assets';

module.exports = {
	workingDirectory: workingDirectory,
	scrapeFilesPath : scrapeFilesPath,
	latestDirectory : scrapeFilesPath + '/latest/',
	archivePath : scrapeFilesPath + '/archive/',
	extractedDirectory: extractedDirectory,
	iconsFileName: 'artifactory.zip',
	essentialsLocalPath: essentialsLocalPath,
	essentialsAssetPath: essentialsAssetPath,
	fileSaverModified: src + 'FileSaverModified.js',
	configPath: appRoot + '/config.json',
	filesToCompareAndCommit: [
		{
			icomoonFile: extractedDirectory + 'style.css',
			essentialsFile: essentialsAssetPath + '/stylesheets/artifactory-icons.less',
			essentialsFileName: 'artifactory-icons.less'
		},
		{
			icomoonFile: extractedDirectory + 'fonts/artifactory.svg',
			essentialsFile: essentialsAssetPath + '/fonts/artifactory.svg',
			essentialsFileName: 'artifactory.svg'
		}
	]
};
