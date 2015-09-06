'use strict';

let port = process.env.PORT || 3000
let http = require('./app');

http.listen(port, function () {
	console.log(`Server listen on ${port}`)
});