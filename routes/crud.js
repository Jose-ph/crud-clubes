const express = require('express');

const crudRoutes = express.Router();
const fs = require('fs');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const teamsPath = './data/equipos.json';
function getTeamById(id, teams) {
  const index = teams.findIndex((team) => team.id === id);
  const team = teams[index];
  return team;
}
function getTeams(path, fileSystemReadFunction) {
  const teamsData = fileSystemReadFunction(path);
  return JSON.parse(teamsData);
}
// WARNING this function changes the  teams array
function addTeam(newTeam, path, teams, fileSystemWriteFunction) {
  teams.push(newTeam);
  const newTeams = teams;
  const stringifyData = JSON.stringify(newTeams);

  fileSystemWriteFunction(path, stringifyData);
  // fs.writeFileSync(path, stringifyData);
}

function saveTeams(teams, path, fileSystemWriteFunction) {
  const stringifyData = JSON.stringify(teams);

  fileSystemWriteFunction(path, stringifyData);
}
function deleteTeamById(id, teams) {
  // ID must be unique

  const $teams = teams.map((element) => ({ ...element }));

  const index = $teams.findIndex((team) => team.id === id);
  if (index > -1) {
    $teams.splice(index, 1);

    return $teams;
  }

  return false;
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
  res.status(200);
  res.type('.html');
});

crudRoutes.get('/teams/addteam', (req, res) => {
  res.render('createteamform', {
    layout: 'main',
  });
  res.status(200);
  res.type('.html');
});
crudRoutes.get('/teams/:id', (req, res) => {
  const teamId = Number(req.params.id);
  const teams = getTeams(teamsPath, fs.readFileSync);
  const teamDetail = getTeamById(teamId, teams);
  console.log(teamDetail);
  res.render('teamDetail', {
    layout: 'main',
    data: {
      teamDetail,
    },
  });
});
crudRoutes.post('/teams/addteam', upload.single('crestUrl'), (req, res) => {
  const newTeam = req.body;
  newTeam.area = { id: 2072, name: 'England' };
  newTeam.lastUpdated = new Date();
  // newTeam.crestUrl = req.file.path;
  // Fix upload path not working in html
  // const { path } = req.file;
  // console.log(path);
  // ADD id check function
  newTeam.id = Number(req.body.id);

  const teams = getTeams(teamsPath, fs.readFileSync);
  addTeam(newTeam, teamsPath, teams, fs.writeFileSync);

  res.status(201).type('.html').send('<h1>Equipo creado con éxito</h1>');
});
crudRoutes.delete('/teams/delete/:id', (req, res) => {
  const teams = getTeams(teamsPath, fs.readFileSync);
  const teamId = req.params.id;
  const modifiedTeams = deleteTeamById(teamId, teams);

  if (modifiedTeams !== false) {
    saveTeams(modifiedTeams, teamsPath, fs.writeFileSync);
    res.status(200).type('.html').send('<h1>Equipo ELIMINADO con éxito</h1>');
  } else {
    res.status(409).type('.html').send('<h1>No se pudo eliminar el equipo ID inexistente </h1>');
  }
  // saveTeams(modifiedTeams, teamsPath, fs.writeFileSync);
});
crudRoutes.put('/teams/update/:id', (req, res) => {
  const teamToBeUpdatedId = req.params.id;
  const teams = getTeams(teamsPath);
  const index = teams.findIndex((team) => team.id === teamToBeUpdatedId);
  teams[index] = req.body;
  res.status(200).send('<h1>Equipo modificado con éxito</h1>');
});
module.exports = crudRoutes;
// make ID uniques

// add try-catch
