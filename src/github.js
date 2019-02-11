const fs = require('fs');
const fsExtra = require('fs-extra');
const appRoot = require('app-root-path');
const git = require('nodegit');
const paths = require(appRoot + '/src/paths.js');
const utils = require(appRoot + '/src/utils.js');

const log = utils.log;
const config = JSON.parse(utils.getConfig());
const essentialsRepoUrl = 'https://github.com/jfrog/jfrog-ui-essentials.git';
const signature = git.Signature.create(config.gitCommitAuther, config.gitCommitEmail, Math.round(Date.now() / 1000),
	60);

let repo, index, remote, branch;

let cloneEssentialsRepo = () => {

	// delete old essentials if exists
	if (fs.existsSync(paths.essentialsLocalPath)) {
		fsExtra.removeSync(paths.essentialsLocalPath);
	}

	log(`cloning ${essentialsRepoUrl}`);
	return git.Clone(essentialsRepoUrl, paths.essentialsLocalPath, {checkoutBranch: config.essentialsBranch})
	          .then(repoResult => {
		          repo = repoResult;
		          log(`Done cloning repo`);
	          });
};


let checkForChanges = () => {

	let filesToCommit = [];
	log('Checking for changes');
	return new Promise((resolve, reject) => {

		return repo.getStatus().then(function (statuses) {

			let statusToText = status => {
				var words = [];
				if (status.isNew()) {
					words.push('NEW');
				}
				if (status.isModified()) {
					words.push('MODIFIED');
				}
				if (status.isTypechange()) {
					words.push('TYPECHANGE');
				}
				if (status.isRenamed()) {
					words.push('RENAMED');
				}
				if (status.isIgnored()) {
					words.push('IGNORED');
				}

				return words.join(' ');
			};

			if (statuses.length) {
				statuses.forEach(file => {
					filesToCommit.push(file.path());
					log(file.path() + ' ' + statusToText(file));
					return resolve(filesToCommit);
				});
			} else {
				return resolve(false);
			}
		});

	});
};

let stageFiles = filesToCommit => repo.refreshIndex()
                                      .then(_index => index = _index)
                                      .then(() => {
	                                      log(`staging files: ${filesToCommit}`);
	                                      return Promise.all(filesToCommit.map(path => index.addByPath(path)));
                                      });

let commitAndPush = msg => {
	let oid = "";
	return index.write()
	     .then(() => index.writeTree())
	     .then(oidResult => {
		     oid = oidResult;
		     return git.Reference.nameToId(repo, 'HEAD');
	     })
	     .then(head => repo.getCommit(head))
	     .then(parent => repo
		     .createCommit('HEAD', signature, signature, msg, oid, [parent]))

	     /// PUSH
	     .then(() => repo.getRemote('origin')
	                     .then(remoteResult => {
		                     log('remote Loaded');
		                     remote = remoteResult;
		                     // Create the push object for this remote
		                     return remote.push(
			                     [`refs/heads/${config.essentialsBranch}:refs/heads/${config.essentialsBranch}`],
			                     {
				                     callbacks: {
					                     credentials: (url, userName) => git
						                     .Cred.userpassPlaintextNew(config.githubUser, config.githubPassword)
				                     }
			                     }
		                     );

	                     }).catch(err => log(err)))
	     .then(() => log('remote Pushed!'));

};

let commitEssentialsDist = () => {
	return checkForChanges()
		.then(changedArr => {
			let filesToCommit = changedArr.filter(filePath => filePath !== 'package-lock.json');
			console.log(filesToCommit);
			return filesToCommit;
		})
		.then(stageFiles)
		.then(() => "Automoon - dist folder")
		.then(commitAndPush)
};

module.exports = {
	cloneEssentialsRepo,
	checkForChanges,
	commitAndPush,
	stageFiles,
	commitEssentialsDist
};