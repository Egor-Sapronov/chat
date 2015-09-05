'use strict';

let express = require('express');
let methodOverride = require('method-override');
let bodyparser = require('body-parser');
let app = express();

app.use('/static', express.static('./client/dist'));
app.set('view engine', 'jade');
app.set('views', './client/src/templates');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
	extended: false
}));
app.use(methodOverride());

app.get('/', function(req,res){
	res.render('index');
});

module.exports = app;