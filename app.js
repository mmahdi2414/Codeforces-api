require('dotenv').config();
const path = require('path');
const express = require('express');
const body_parser = require('body-parser');
const log = require('./logger/logger');
const home = require('./router/home');
const update = require('./service/update');
const port = process.env.PORT || 3000;
const app = express();
const mongoose = require('mongoose');

app.set('view engine' , 'ejs');
app.use(express.static(path.join(__dirname, '/public')));
app.use(body_parser.json());
app.use(express.json());

app.use('/' , home);

app.use(function(req, res) {
	    log('error' , `url: ${req.url} not found.`);
	    return res.status(404).json({message: `url: ${req.url} Not found.`});
    }
);



const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.rbxbu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose
	.connect(connectionString, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => {
		app.listen(port, async ()=> {
			await update();

            setInterval(async() => await update, 10 * 60 * 1000);
			log('info', `app started at port ${port}`);
		});
	})
	.catch((err) => {
		log('error', err);
	});