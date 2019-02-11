const appRoot = require('app-root-path');
const puppeteer = require('puppeteer');




const utils = require(appRoot + '/src/utils.js');
const paths = require(appRoot + '/src/paths.js');
const log = utils.log;
const config = JSON.parse(utils.getConfig());

const icomoonUser = config.icomoonUser;
const icomoonPassword = config.icomoonPassword;
const FileSaverModified = require(paths.fileSaverModified);


const ICOMOON_URL = 'https://icomoon.io/';

module.exports = () => {
	return new Promise((resolve, reject) => {
		try {
			(async () => {
				const browser = await puppeteer.launch({
					headless: false
					//slowMo: 50
				});
				const page = await browser.newPage();
				log('Navigating to ' + ICOMOON_URL);
				await page.goto(ICOMOON_URL, {
					waitUntil: 'networkidle0'
				});

				await page.waitForSelector('#nav-profile > button');
				await page.evaluate(() => document.querySelector('#nav-profile > button').click());
				await page.focus('#email-nav');

				log(`Logging in. User - ${icomoonUser} Password - ${icomoonPassword}`);
				await page.type('#email-nav', icomoonUser, {delay: 100});
				await page.type('#pass-nav', icomoonPassword, {delay: 100});

				const navigationPromise = page.waitForNavigation();
				await page.click('#log-in');
				await navigationPromise;
				log('Logged in to icomoon');
				await page.goto('https://icomoon.io/app/#/select/font', {
					waitUntil: 'networkidle0'
				});
				await page.goto('https://icomoon.io/app/#/select/font', {
					waitUntil: 'networkidle0'
				});

				await page.waitForFunction('document.querySelector(\'button[ng-click=download\\\\(\\\\)]\') !== null');

				// modify FileSaver
				log('Modifying FileSaver');
				await page.evaluate(FileSaverModified);

				// click on download
				log('Clicking on download button');
				await page.evaluate(() => document.querySelector('button[ng-click=download\\(\\)]').click());

				await page.waitForSelector('#sent');

				await page.evaluate(() => window.msg)
				          .then(msg => log(msg));

				await browser.close();
				resolve(true);
			})();
		} catch (err) {
			throw err;
		}

	});
};



