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
function saveTeam(data, path) {
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync(path, data);
}
// crudRoutes.use(express.json());
crudRoutes.use(express.urlencoded({ extended: true }));
crudRoutes.get('/', (req, res) => {
  const teams = getTeams(teamsPath);

  res.render('teams', {
    layout: 'main',
    data: {
      teams,
    },
  });
});

crudRoutes.get('/teams/addteam', (req, res) => {
  res.render('createteamform', {
    layout: 'main',
  });
});
crudRoutes.post('/teams/addteam', upload.single('image'), (req, res) => {
  const newTeamDefault = req.body;
  newTeamDefault.area = { id: 2072, name: 'England' };
  newTeamDefault.lastUpdated = new Date();
  console.log(newTeamDefault);
  // console.log('Este es el archivo subido', req.file);
  // console.log(req.body);
  res.status(203).send('<h1>Equipo creado con éxito</h1>');
});
module.exports = crudRoutes;
