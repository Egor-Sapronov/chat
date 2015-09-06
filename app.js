'use strict';

let express = require('express');
let methodOverride = require('method-override');
let bodyparser = require('body-parser');
let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
let chat = require('./server/libs/chat');
let constants = require('./server/libs/constants');

app.use('/static', express.static('./client/dist'));
app.set('view engine', 'jade');
app.set('views', './client/src/templates');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
	extended: false
}));
app.use(methodOverride());

app.get('/', function (req, res) {
	res.render('index');
});

chat.on(constants.USER_LOGIN, function (user) {
	chat.pushMessage({
		content: `User ${user.username} joint chat`
	});

	io.send({
		type: 'user::login',
		id: user.id,
		username: user.username
	});
});

chat.on(constants.USER_LOGOUT, function (user) {
	chat.pushMessage({
		content: `User ${user.username} leave chat`
	});

	io.send({
		type: 'user::logout',
		id: user.id,
		username: user.username
	});
});

chat.on(constants.MESSAGE_PUSH, function (message) {
	io.send({
		type: 'message',
		id: message.id,
		content: message.content,
		date: message.createdAt,
		user: message.user
	});
});

io.on('connection', function (socket) {
	socket.on('disconnect', function () {
		chat.logout(socket.user);
	});

	socket.on('fetch::data', function () {
		if (!socket.user) {
			return socket.send({
				type: 'redirect',
				destination: 'signup'
			});
		}

		return chat.getMessages()
			.then(function (messages) {
				socket.send({
					type: 'messages::list',
					content: messages
				});

				return chat.getOnlineUsers();
			})
			.then(function (users) {
				socket.send({
					type: 'users::list',
					content: users
				});
			})
			.catch(function (reason) {
				return socket.send({
					type: 'error',
					content: reason
				});
			});

	});

	socket.on('message::push', function (content) {
		chat.pushMessage({
			userId: socket.user.id,
			content: content
		})
			.catch(function (reason) {
				return socket.send({
					type: 'error',
					content: reason
				});
			});
	});

	socket.on('user::login', function (username) {
		chat.login(username)
			.then(function (user) {
				socket.user = user;
				socket.send({
					type: 'redirect',
					destination: 'chat'
				});
			})
			.catch(function (reason) {
				return socket.send({
					type: 'error',
					content: reason
				});
			});
	});

	socket.on('user::register', function (username) {
		chat
			.registerUser(username)
			.then(function (user) {
				return chat.login(user.username);
			})
			.then(function (user) {
				socket.user = user;
				socket.send({
					type: 'redirect',
					destination: 'chat'
				});
			})
			.catch(function (reason) {
				return socket.send({
					type: 'error',
					content: reason
				});
			});
	});
});

module.exports = http;