const express = require('express');

const crudRoutes = express.Router();
const fs = require('fs');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const teamsPath = './data/equipos.json';
function getTeams(path) {
  const teamsData = fs.readFileSync(path);
  return JSON.parse(teamsData);
}
function saveTeam(data, path, previousData) {
  previousData.push(data);
  const newData = previousData;
  const stringifyData = JSON.stringify(newData);

  fs.writeFileSync(path, stringifyData);
}
// crudRoutes.use(express.json());
crudRoutes.use(express.urlencoded({ extended: true }));
crudRoutes.get('/', (req, res) => {
  const teams = getTeams(teamsPath);

  res.render('teams', {
    layout: 'main',
    data: {
      teams,
      teamsQuantity: teams.length,

    },
  });
});

crudRoutes.get('/teams/addteam', (req, res) => {
  res.render('createteamform', {
    layout: 'main',
  });
});
crudRoutes.post('/teams/addteam', upload.single('image'), (req, res) => {
  const newTeam = req.body;
  newTeam.area = { id: 2072, name: 'England' };
  newTeam.lastUpdated = new Date();

  const teams = getTeams(teamsPath);
  saveTeam(newTeam, teamsPath, teams);
  // fix names in form
  res.status(201).send('<h1>Equipo creado con éxito</h1>');
});
module.exports = crudRoutes;
