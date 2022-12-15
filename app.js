const express = require('express');
const exphbs = require('express-handlebars');

const routes = require('./routes/routes');

const app = express();
const hbs = exphbs.create();

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use('/', routes);
module.exports = app;
