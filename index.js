'use strict';

let app = require('./app');
let port = process.env.PORT || 3000
app.listen(port, function () {
	console.log(`Server listen on ${port}`)
});