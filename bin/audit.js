#!/usr/bin/env node --unhandled-rejections=strict

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');

(async () => {
	const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
	const options = { port: chrome.port };
	const runnerResult = await lighthouse('https://rednaw.github.io/exhibitionDB/', options);

	const reportHtml = runnerResult.report;
	fs.writeFileSync('lhreport.html', reportHtml);

	await chrome.kill();
})();
