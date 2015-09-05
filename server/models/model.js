'use strict';
let crypto = require('crypto');
let objectAssign = require('object-assign');

let Entity = {
	create: function (type) {
		let entity = Object.create(Entity.prototype)

		entity.id = crypto.randomBytes(4).toString('hex');
		entity.type = type;

		return entity;
	},
	isEntity: function (obj, type) {
		if (!Entity.prototype.isPrototypeOf(obj)) {
			return false;
		}

		return type ? obj.type === type : true;
	},
	prototype: {}
};

let User = {
	create: function (username) {
		let proto = objectAssign(Entity.create('user'), User.prototype);
		let user = Object.create(proto);

		user.username = username;

		return user;
	},
	isUser: function (obj) {
		return Entity.isEntity(obj, 'user');
	}
};

let Message = {
	create: function (options) {
		let proto = objectAssign(Entity.create('message'), Message.prototype);
		let message = Object.create(proto);

		message.content = options.content;
		message.userId = options.userId;
		message.createdAt = Date.now();

		return message;
	},
	isMessage: function (obj) {
		return Entity.isEntity(obj, 'message');
	}
}

module.exports = {
	User: User,
	Message: Message
};