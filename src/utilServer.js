const express = require('express');
const appRoot = require('app-root-path');
const fileUpload = require('express-fileupload');
const cors = require('cors');


const paths = require(appRoot + '/src/paths.js');
const utils = require(appRoot + '/src/utils.js');
const moment = require('moment');
const fs = require('fs');
const log = utils.log;

const port = 4200;
global.state = 'IDLE';
const app = express({port});
const http = require('http').Server(app);

const corsOptions = {
	credentials: true,
	origin: (origin, callback) => {
		return callback(null, true);
	}
};

app.use(cors(corsOptions));

app.use(fileUpload());

app.post('/', (req, res) => {

	if (!req.files) {
		return res.status(400).send('No files were uploaded.');
	}

	req.files.iconsFile.mv(paths.latestDirectory + paths.iconsFileName, err => {
		if (err) {
			return res.status(500).send(JSON.stringify(err));
		}

		res.send('File sent from scraper!');

		// copy file to archive
		fs.createReadStream(paths.latestDirectory + paths.iconsFileName)
		  .pipe(fs.createWriteStream(
			  paths.archivePath + paths.iconsFileName.split('.')[0] + '-' + moment().format(
			  'YYYYMMDD-hhmmss') + '.zip'));
	});

});

module.exports = new Promise(resolve => {
	app.listen(port, () => {
		console.log(`Automoon server listening on port ${port}`);
		resolve();
	});
});
