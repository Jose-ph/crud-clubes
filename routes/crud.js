const express = require('express');

const crudRoutes = express.Router();
const fs = require('fs');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });
crudRoutes.use(express.static('uploads'));

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

function addTeam(newTeam, path, teams, fileSystemWriteFunction) {
  // WARNING this function changes the  teams array
  teams.push(newTeam);
  const newTeams = teams;
  const stringifyData = JSON.stringify(newTeams);

  fileSystemWriteFunction(path, stringifyData);
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
  try {
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
    const teams = getTeams(teamsPath, fs.readFileSync);
    const teamDetail = getTeamById(teamId, teams);

    res.render('teamDetail', {
      layout: 'main',
      data: {
        teamDetail,
      },
    });
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

    const teams = getTeams(teamsPath, fs.readFileSync);
    addTeam(newTeam, teamsPath, teams, fs.writeFileSync);

    res.status(201).type('.html').send('<h1>Equipo creado con éxito</h1>');
  } catch (error) {
    console.log(error);
    res.status(500).type('.html').send(`<h1>Error ${error}</h1>`);
  }
});

crudRoutes.get('/teams/update/:id', (req, res) => {
  try {
    const teamToBeUpdatedId = Number(req.params.id);
    const teams = getTeams(teamsPath, fs.readFileSync);

    const teamToBeUpdated = getTeamById(teamToBeUpdatedId, teams);
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
    const teams = getTeams(teamsPath, fs.readFileSync);
    const index = teams.findIndex((team) => team.id === teamToBeUpdatedId);
    teams[index] = req.body;
    teams[index].area = { id: 2072, name: 'England' };
    teams[index].lastUpdated = new Date();
    teams[index].crestUrl = req.file.filename;
    teams[index].id = Number(req.body.id);

    saveTeams(teams, teamsPath, fs.writeFileSync);
    res.status(200).send('<h1>Equipo modificado con éxito</h1>');
  } catch (error) {
    console.log(error);
    res.status(500).type('.html').send(`<h1>Error ${error}</h1>`);
  }
});
crudRoutes.get('/teams/delete/:id', (req, res) => {
  try {
    const teams = getTeams(teamsPath, fs.readFileSync);
    const teamId = Number(req.params.id);
    const modifiedTeams = deleteTeamById(teamId, teams);
    console.log(teamId);
    console.log(modifiedTeams);

    if (modifiedTeams !== false) {
      saveTeams(modifiedTeams, teamsPath, fs.writeFileSync);
      res.status(200).type('.html').send('<h1>Equipo ELIMINADO con éxito</h1>');
    } else {
      res.status(409).type('.html').send('<h1>No se pudo eliminar el equipo ID inexistente </h1>');
    }
  } catch (error) {
    console.log(error);
    res.status(500).type('.html').send(`<h1>Error ${error}</h1>`);
  }
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
