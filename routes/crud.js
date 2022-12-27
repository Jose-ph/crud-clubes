const express = require('express');

const crudRoutes = express.Router();
const fs = require('fs');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });
crudRoutes.use(express.static('uploads'));
const utils = require('../utils/utils');

const teamsPath = './data/equipos.json';

crudRoutes.get('/', (req, res) => {
  try {
    const teams = utils.getTeams(teamsPath, fs.readFileSync);

    res.render('teams', {
      layout: 'main',
      data: {
        teams,
        teamsQuantity: teams.length,

      },
    });

    res.status(200);
    res.type('.html');
  } catch (error) {
    res.render('errorMessage', {
      layout: 'main',
      data: {
        errorMessage: error,

      },
    });
    res.status(404);
    res.type('.html');
  }
});

crudRoutes.get('/teams/addteam', (req, res) => {
  try {
    res.render('createteamform', {
      layout: 'main',
    });
    res.status(200);
    res.type('.html');
  } catch (error) {
    res.render('errorMessage', {
      layout: 'main',
      data: {
        errorMessage: error,

      },
    });
    res.status(404);
    res.type('.html');
  }
});
crudRoutes.get('/teams/:id', (req, res) => {
  try {
    const teamId = Number(req.params.id);

    const teams = utils.getTeams(teamsPath, fs.readFileSync);
    const idExists = utils.checkId(teamId, teams);

    if (idExists) {
      const teamDetail = utils.getTeamById(teamId, teams);

      res.render('teamDetail', {
        layout: 'main',
        data: {
          teamDetail,
        },
      });
    } else {
      res.render('errorMessage', {
        layout: 'main',
        data: {
          errorMessage: 'Invalid ID',

        },
      });
      res.status(404);
      res.type('.html');
    }
  } catch (error) {
    res.render('errorMessage', {
      layout: 'main',
      data: {
        errorMessage: error,

      },
    });
    res.status(404);
    res.type('.html');
  }
});
crudRoutes.post('/teams/addteam', upload.single('crestUrl'), (req, res) => {
  try {
    const newTeam = req.body;
    newTeam.area = { id: 2072, name: 'England' };
    newTeam.lastUpdated = new Date();
    console.log(req.file);
    newTeam.crestUrl = req.file.filename;

    // ADD id check function
    newTeam.id = Number(req.body.id);

    const teams = utils.getTeams(teamsPath, fs.readFileSync);
    utils.addTeam(newTeam, teamsPath, teams, fs.writeFileSync);

    res.status(201).type('.html').send('<h1>Equipo creado con éxito</h1>');
  } catch (error) {
    console.log(error);
    res.status(500).type('.html').send(`<h1>Error ${error}</h1>`);
  }
});

crudRoutes.get('/teams/update/:id', (req, res) => {
  try {
    const teamToBeUpdatedId = Number(req.params.id);
    const teams = utils.getTeams(teamsPath, fs.readFileSync);

    const teamToBeUpdated = utils.getTeamById(teamToBeUpdatedId, teams);
    res.render('updateTeamForm', {
      layout: 'main',
      data: { teamToBeUpdated },
    });
    res.status(200).type('.html');
  } catch (error) {
    console.log(error);
    res.status(500).type('.html').send(`<h1>Error ${error}</h1>`);
  }
});
crudRoutes.post('/teams/update/:id', upload.single('crestUrl'), (req, res) => {
  try {
    const teamToBeUpdatedId = Number(req.params.id);
    const teams = utils.getTeams(teamsPath, fs.readFileSync);
    const index = teams.findIndex((team) => team.id === teamToBeUpdatedId);
    teams[index] = req.body;
    teams[index].area = { id: 2072, name: 'England' };
    teams[index].lastUpdated = new Date();
    teams[index].crestUrl = req.file.filename;
    teams[index].id = Number(req.body.id);

    utils.saveTeams(teams, teamsPath, fs.writeFileSync);
    res.status(200).send('<h1>Equipo modificado con éxito</h1>');
  } catch (error) {
    console.log(error);
    res.status(500).type('.html').send(`<h1>Error ${error}</h1>`);
  }
});
crudRoutes.get('/teams/delete/:id', (req, res) => {
  try {
    const teams = utils.getTeams(teamsPath, fs.readFileSync);
    const teamId = Number(req.params.id);
    const modifiedTeams = utils.deleteTeamById(teamId, teams);
    console.log(teamId);
    console.log(modifiedTeams);

    if (modifiedTeams !== false) {
      utils.saveTeams(modifiedTeams, teamsPath, fs.writeFileSync);
      res.status(200).type('.html').send('<h1>Equipo ELIMINADO con éxito</h1>');
    } else {
      res.status(409).type('.html').send('<h1>No se pudo eliminar el equipo ID inexistente </h1>');
    }
  } catch (error) {
    console.log(error);
    res.status(500).type('.html').send(`<h1>Error ${error}</h1>`);
  }
});

crudRoutes.get('*', (req, res) => {
  res.status(404);
  res.send('INVALID ROUTE');
});

module.exports = crudRoutes;
// Add the ID check function

// TESTS

// Idea from an article to write code

// Express follows a basic structure for responding to requests based on a route signature, i.e.;

// app.get('/users/report', function(req, res) {
//     res.render('userreport', { title: 'Users Report' });
// });
// It is a good practice to break the handler code into its own function
// , and then use that handler in the route.

// function userReportHandler(req, res) {
//     res.render('userreport', { title: 'Users Report' });
// }

// app.get('/users/report', userReportHandler);
