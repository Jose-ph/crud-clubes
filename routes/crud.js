const express = require('express');

const crudRoutes = express.Router();
const fs = require('fs');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const teamsPath = './data/equipos.json';
function getTeams(path, fileSystemFunction) {
  const teamsData = fileSystemFunction(path);
  return JSON.parse(teamsData);
}
function addTeam(newTeam, path, teams, callBackAdd) {
  teams.push(newTeam);
  const newTeams = teams;
  const stringifyData = JSON.stringify(newTeams);

  callBackAdd(path, stringifyData);
  // fs.writeFileSync(path, stringifyData);
}
function saveTeams(teams, path, callBackSave) {
  const stringifyData = JSON.stringify(teams);

  callBackSave(path, stringifyData);
}
function deleteTeamById(id, teams) {
  // ID must be unique
  // use truthy or change new teams ids to number
  const $teams = teams.map((element) => ({ ...element }));

  const index = $teams.findIndex((team) => team.id == id);
  if (index > -1) {
    $teams.splice(index, 1);

    return $teams;
  }
  const message = 'No se pudo borrar';
  return message;
}

crudRoutes.get('/', (req, res) => {
  const teams = getTeams(teamsPath, fs.readFileSync);

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
crudRoutes.put('/teams/update/:id', (req, res) => {
  const teamToBeUpdatedId = req.params.id;
  const teams = getTeams(teamsPath);
  const index = teams.findIndex((team) => team.id == teamToBeUpdatedId);
  teams[index] = req.body;
  res.status(200).send('<h1>Equipo modificado con éxito</h1>');
});
module.exports = crudRoutes;
// make ID uniques
// change ids to number
// add try-catch
