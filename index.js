'use strict';

const {app, clipboard, Menu, Tray, BrowserWindow} = require('electron');
const ip = require('public-ip');

let window;
let tray;
let interval;
let address;

app.on('ready', () => {
	window = new BrowserWindow({
		show: false,
	});

	window.loadURL(`file://${__dirname}/index.html`);

	let context = Menu.buildFromTemplate([
		{label: 'Quit', click: app.quit},
	]);

	tray = new Tray(`${__dirname}/static/app.${process.platform === 'win32' ? 'ico' : 'png'}`);
	tray.setContextMenu(context);
	tray.on('click', click);

	interval = setInterval(update, 1000 * 60);
	setImmediate(update);
});

app.on('before-quit', () => {
	clearInterval(interval);
});

const click = () => {
	update(address => {
		clipboard.writeText(address);
		notify('IPv4 address copied to clipboard.', address);
	});
};

const update = callback => {
	ip.v4().then(data => {
		address = data;
		tray.setToolTip(address);
		callback(address);
	});
};

const notify = (title, body) => {
	window.webContents.send('notify', {
		title: title,
		body: body
	});
};
