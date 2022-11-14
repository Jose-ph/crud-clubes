const express = require('express');

const crudRoutes = express.Router();
const fs = require('fs');

const teamsPath = './data/equipos.json';
function getTeams(path) {
  const teamsData = fs.readFileSync(path);
  return JSON.parse(teamsData);
}
function saveTeam(data, path) {
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync(path, data);
}

crudRoutes.get('/teams', (req, res) => {
  res.render('home', {
    layout: 'teams',
  });
});

crudRoutes.get('/teams/addteam', (req, res) => {
  res.render('home', {
    layout: 'createTeamForm',
  });
});
module.exports = crudRoutes;
