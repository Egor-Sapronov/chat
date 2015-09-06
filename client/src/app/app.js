/* global io */
'use strict';

let socket = io();

let $loginContainer = document.getElementById('login_container');
let $loginInput = document.getElementById('login_input');
let $loginButton = document.getElementById('login_button');
let $signupContainer = document.getElementById('signup_contanier');
let $signupInput = document.getElementById('signup_input');
let $signupButton = document.getElementById('signup_button');
let $chatContainer = document.getElementById('chat_container');
let $messageInput = document.getElementById('message_input');
let $messageButton = document.getElementById('message_button');
let $messagesContainer = document.getElementById('messages_container');
let $usersContainer = document.getElementById('users_container');

$loginButton.onclick = () => {
	socket.emit('user::login', $loginInput.value);
}

$signupButton.onclick = () => {
	socket.emit('user::register', $signupInput.value);
};

$messageButton.onclick = () => {
	socket.emit('message::push', $messageInput.value);
};

function show(domElement) {
	domElement.style.display = 'block';
}

function hide(domElement) {
	domElement.style.display = 'none';
}

function refreshUsers(items) {
	$usersContainer.innerHTML = '';

	items.forEach((user) => {
		addUser(user);
	});
}

function removeUser(user) {
	let nodeForRemove = document.getElementById(`user${user.id}`);

	if (nodeForRemove) {
		$usersContainer.removeChild(nodeForRemove);
	}
}

function addUser(user) {
	if (!document.getElementById(`user${user.id}`)) {
		let listItem = document.createElement('li');
		listItem.id = `user${user.id}`;
		listItem.innerHTML = user.username;
		$usersContainer.appendChild(listItem);
	}
}

function refreshMessages(items) {
	$messagesContainer.innerHTML = '';

	items.forEach((message) => {
		addMessage(message);
	});
}

function addMessage(message) {
	if (!document.getElementById(`message${message.id}`)) {
		let listItem = document.createElement('li');
		listItem.id = `message${message.id}`;
		if (message.user) {
			let nameItem = document.createElement('p');
			nameItem.innerHTML = `from: ${message.user.username}`;

			listItem.appendChild(nameItem);
		}
		let contentItem = document.createElement('p');
		contentItem.innerHTML = message.content;
		listItem.appendChild(contentItem);

		$messagesContainer.appendChild(listItem);
	}
}

window.onhashchange = () => {
	switch (location.hash) {
		case '#chat':
			show($chatContainer);
			hide($signupContainer);
			hide($loginContainer);
			socket.emit('fetch::data', null);
			break;
		case '#signin':
			show($loginContainer);
			hide($signupContainer);
			hide($chatContainer);
			break;
		case '#signup':
			hide($loginContainer);
			show($signupContainer);
			hide($chatContainer);
			break;
	}
};

socket.on('message', (message) => {
	switch (message.type) {
		case 'error':
			alert(message.content);
			break;
		case 'redirect':
			location.hash = message.destination;
			break;
		case 'message':
			addMessage(message);
			break;
		case 'messages::list':
			refreshMessages(message.content);
			break;
		case 'users::list':
			refreshUsers(message.content);
			break;
		case 'user::login':
			addUser(message);
			break;
		case 'user::logout':
			removeUser(message);
			break;
	}
});

location.hash = '';