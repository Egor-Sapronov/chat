'use strict';

let expect = require('chai').expect;
let model = require('../server/models/model');

describe('Chat models', function () {
	describe('Message', function () {
		it('Should exist', function () {
			expect(model.Message).to.be.ok;
		});

		describe('#create', function () {
			it('Should create new user object', function () {
				let message = model.Message.create({
					userId: 1,
					content: 'content'
				});

				expect(message).to.be.ok;
				expect(message.id).to.be.ok;
				expect(message.userId).to.be.ok;
				expect(message.createdAt).to.be.ok;
			});
		});

		describe('#isMessage', function () {
			it('Should return true if passed object instance of Thread and false if not', function () {
				let message = model.Message.create({});

				expect(model.Message.isMessage(message)).to.be.ok;
				expect(model.Message.isMessage({})).not.to.be.ok;
			});
		});
	});

	describe('User', function () {
		it('Should exist', function () {
			expect(model.User).to.be.ok;
		});

		describe('#create', function () {
			it('Should create new user object', function () {
				let user = model.User.create('egor');

				expect(user).to.be.ok;
				expect(user.id).to.be.ok;
				expect(user.username).to.be.equal('egor');
			});
		});

		describe('#isUser', function () {
			it('Should return true if passed object instance of Thread and false if not', function () {
				let user = model.User.create('egor');

				expect(model.User.isUser(user)).to.be.ok;
				expect(model.User.isUser({})).not.to.be.ok;
			});
		});
	});
});