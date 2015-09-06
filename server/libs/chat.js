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
			let usersList = new Map();

			onlineUsers.forEach(function (id) {
				usersList.set(id, users.get(id));
			});

			return resolve(usersList);
		});
	}

	function login(userId) {
		return new Promise(function (resolve, reject) {
			if (!users.has(userId)) {
				return reject('Not registered user');
			}

			onlineUsers.add(userId);

			this.emit(constants.USER_LOGIN, users.get(userId));

			return resolve(users.get(userId));
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

			this.emit(constants.MESSAGE_PUSH, message);

			return resolve(message);
		}.bind(this));
	}

	return chatInstance;
})();