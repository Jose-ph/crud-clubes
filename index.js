const express = require('express');
const exphbs = require('express-handlebars');
const fs = require('fs');
const multer = require('multer');

const PORT = 8080;

const app = express();
const hbs = exphbs.create();

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.usen(express.json());

app.get('/', (req, res) => {
  res.render('home', {
    layout: 'main',
  });
});

app.listen(PORT);
