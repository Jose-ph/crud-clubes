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
  const $teams = teams.map((element) => ({ ...element }));

  const index = $teams.findIndex((team) => team.id === id);
  if (index > -1) {
    $teams.splice(index, 1);

    return $teams;
  }

  return false;
}
function checkId(id, teams) {
  const idList = [];
  teams.forEach((team) => {
    idList.push(team.id);
  });

  const index = teams.findIndex((team) => team.id === id);
  if (index > -1) {
    return true;
  }
  return false;
}

module.exports = {
  getTeamById, getTeams, addTeam, saveTeams, deleteTeamById, checkId,
};
