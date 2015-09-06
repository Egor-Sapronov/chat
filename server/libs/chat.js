'use strict';

let User = require('../models/model').User;
let Message = require('../models/model').Message;
let EventEmitter = require('eventemitter2').EventEmitter2;
let objectAssign = require('object-assign');
let constants = require('./constants');

module.exports = (function () {
	let users = new Map();
	let messages = new Map();
	let onlineUsers = new Set();

	let chat = {
		registerUser: registerUser,
		getMessages: getMessages,
		getUsers: getUsers,
		pushMessage: pushMessage,
		login: login,
		logout: logout,
		clearChat: clear,
		getOnlineUsers: getOnlineUsers
	};

	let chatInstance = objectAssign(EventEmitter.prototype, chat);

	function clear() {
		return new Promise(function (resolve, reject) {
			users = new Map();
			messages = new Map();
			onlineUsers = new Set();
			resolve(true);
		});
	}

	function getOnlineUsers() {
		return new Promise(function (resolve, reject) {
			let usersList = [];

			onlineUsers.forEach(function (userId) {
				let item = users.get(userId);
				usersList.push({
					id: item.id,
					username: item.username
				});
			});

			return resolve(usersList);
		});
	}

	function login(username) {
		return new Promise(function (resolve, reject) {
			let user;

			users.forEach(function (item) {
				if (item.username === username) {
					user = item;
				}
			});

			if (!user) {
				return reject('Not registered user');
			}

			onlineUsers.add(user.id);

			this.emit(constants.USER_LOGIN, user);

			return resolve(user);
		}.bind(this));
	}

	function logout(user) {
		return new Promise(function (resolve, reject) {
			if (!users.has(user.id)) {
				return reject('Not registered user');
			}

			onlineUsers.delete(user.id)

			this.emit(constants.USER_LOGOUT, user);
			return resolve(user);
		}.bind(this));
	}

	function registerUser(username) {
		return new Promise(function (resolve, reject) {

			if (!username || 0 === username.length) {
				return reject('Username is empty');
			}

			users.forEach(function (user) {
				if (user.username === username) {
					return reject('username already exist');
				}
			});

			let user = User.create(username);

			users.set(user.id, user);

			this.emit(constants.USER_REGISTER, user);

			return resolve(user);
		}.bind(this));
	}

	function getMessages() {
		return new Promise(function (resolve, reject) {
			let items = [];

			messages.forEach(function (message) {
				items.push({
					id: message.id,
					content: message.content,
					date: message.createdAt,
					user: users.get(message.userId)
				});
			});

			return resolve(items);
		});
	}

	function getUsers() {
		return new Promise(function (resolve, reject) {
			return resolve(users);
		});
	}

	function pushMessage(options) {
		return new Promise(function (resolve, reject) {
			let message = Message.create({
				userId: options.userId,
				content: options.content
			});

			messages.set(message.id, message);
			message.user = users.get(options.userId);

			this.emit(constants.MESSAGE_PUSH, message);

			return resolve(message);
		}.bind(this));
	}

	return chatInstance;
})();