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
function addTeam(newTeam, path, teams, callBackAdd) {
  teams.push(newTeam);
  const newTeams = teams;
  const stringifyData = JSON.stringify(newTeams);

  callBackAdd(path, stringifyData);
  // fs.writeFileSync(path, stringifyData);
}
function saveTeams(teams, path, saveMethod) {
  const stringifyData = JSON.stringify(teams);

  saveMethod(path, stringifyData);
  // callBackSave(path, stringifyData);
}
function deleteTeamById(id, teams) {
  // ID must be unique
  // use truthy or change new teams ids to number
  const filteredTeams = teams.filter((team) => team.id != id);

  return filteredTeams;
}

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
crudRoutes.post('/teams/addteam', upload.single('crestUrl'), (req, res) => {
  const newTeam = req.body;
  newTeam.area = { id: 2072, name: 'England' };
  newTeam.lastUpdated = new Date();
  // newTeam.crestUrl = req.file.path;
  // Fix upload path not working in html
  const { path } = req.file;
  console.log(path);

  const teams = getTeams(teamsPath);
  addTeam(newTeam, teamsPath, teams, fs.writeFileSync);

  res.status(201).send('<h1>Equipo creado con éxito</h1>');
});
crudRoutes.delete('/teams/delete/:id', (req, res) => {
  const teams = getTeams(teamsPath);
  const teamId = req.params.id;

  const modifiedTeams = deleteTeamById(teamId, teams);

  saveTeams(modifiedTeams, teamsPath, fs.writeFileSync);
  res.status(200).send('<h1>Equipo ELIMINADO con éxito</h1>');
});
module.exports = crudRoutes;
