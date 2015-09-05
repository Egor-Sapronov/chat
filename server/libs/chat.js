'use strict';

let User = require('../models/model').User;
let Message = require('../models/model').Message;

module.exports = (function () {

	let users = new Map();
	let messages = new Map();

	function clear() {
		return new Promise(function (resolve, reject) {
			users = new Map();
			messages = new Map();

			resolve(true);
		});
	}

	function registerUser(username) {
		return new Promise(function (resolve, reject) {
			users.forEach(function (user) {
				if (user.username === username) {
					return reject('username already exist');
				}
			});

			let user = User.create(username);

			users.set(user.id, user);

			return resolve(user);
		});
	}

	function getMessages() {
		return new Promise(function (resolve, reject) {
			return resolve(messages);
		});
	}

	function getUsers() {
		return new Promise(function (resolve, reject) {
			return resolve(users);
		});
	}

	function pushMessage(options) {
		return new Promise(function (resolve, reject) {
			if (!users.has(options.userId)) {
				return reject('userId not found');
			}

			let message = Message.create({
				userId: options.userId,
				content: options.content
			});

			messages.set(message.id, message);

			return resolve(message);
		});
	}

	return {
		registerUser: registerUser,
		getMessages: getMessages,
		getUsers: getUsers,
		pushMessage: pushMessage,
		clear: clear
	};
})();