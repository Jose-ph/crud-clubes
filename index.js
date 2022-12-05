const express = require('express');
const exphbs = require('express-handlebars');

const routes = require('./routes/routes');

const PORT = 8080;

const app = express();
const hbs = exphbs.create();

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use('/', routes);

const server = app.listen(PORT);
module.exports = { app, server };
