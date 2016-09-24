'use strict';

const {ipcRenderer} = require('electron');

ipcRenderer.on('notify', (event, message) => {
	new Notification(message.title, {
		body: message.body
	});
});
