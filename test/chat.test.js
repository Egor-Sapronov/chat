'use strict';

let expect = require('chai').expect;
let chat = require('../server/libs/chat');
let User = require('../server/models/model').User;
let Message = require('../server/models/model').Message;

describe('Chat app', function () {

	beforeEach(function (done) {
		return chat
			.clear()
			.then(function (result) {
				expect(result).to.be.ok;
				return done();
			});
	});

	describe('#getMessages', function () {
		it('Should exist', function () {
			expect(chat.getMessages).to.be.ok;
		});

		it('Should return empty map if any users is not exists', function (done) {
			return chat
				.getMessages()
				.then(function (messages) {
					expect(Map.prototype.isPrototypeOf(messages)).to.be.ok;
					expect(messages.size).to.be.equal(0);
					return done();
				});
		});

		it('Should return array of existing messages', function (done) {
			return chat
				.registerUser('user')
				.then(function (user) {
					return chat.pushMessage({
						userId: user.id,
						content: 'text'
					});
				})
				.then(function (message) {
					return chat.getMessages();
				})
				.then(function (messages) {
					expect(Map.prototype.isPrototypeOf(messages)).to.be.ok;
					expect(messages.size).to.be.equal(1);

					return done();
				});
		});
	});

	describe('#getUsers', function () {
		it('Should exist', function () {
			expect(chat.getUsers).to.be.ok;
		});

		it('Should return empty map if any users is not exists', function (done) {
			return chat
				.getUsers()
				.then(function (users) {
					expect(Map.prototype.isPrototypeOf(users)).to.be.ok;
					expect(users.size).to.be.equal(0);
					return done();
				});
		});

		it('Should return array of registered users', function (done) {
			return chat
				.registerUser('user').then(function () {
					return chat.getUsers();
				})
				.then(function (users) {
					expect(Map.prototype.isPrototypeOf(users)).to.be.ok;
					expect(users.size).to.be.equal(1);

					return done();
				});
		});
	});

	describe('#pushMessage', function () {
		it('Should exist', function () {
			expect(chat.pushMessage).to.be.ok;
		});

		it('Should reject if user is not exist', function (done) {
			return chat
				.pushMessage({
					userId: 1,
					content: 'text'
				})
				.catch(function (reason) {
					expect(reason).to.be.ok;
					return done();
				});
		});

		it('Should push new message to chat', function (done) {
			return chat
				.registerUser('user')
				.then(function (user) {
					return chat.pushMessage({
						userId: user.id,
						content: 'text'
					});
				})
				.then(function (message) {
					expect(message).to.be.ok;
					expect(Message.isMessage(message)).to.be.ok;
					return done();
				});
		});
	});

	describe('#registerUser', function () {
		it('Should exist', function () {
			expect(chat.registerUser).to.be.ok;
		});

		it('Should create new user if username is not exist', function (done) {
			return chat
				.registerUser('user')
				.then(function (user) {
					expect(user).to.be.ok;
					expect(User.isUser(user)).to.be.ok;
					return done();
				});
		});

		it('Should reject if username is exist', function (done) {
			return chat
				.registerUser('user')
				.then(function (user) {
					return chat.registerUser(user.username);
				})
				.catch(function (reason) {
					expect(reason).to.be.ok;
					return done();
				});
		});
	});
});