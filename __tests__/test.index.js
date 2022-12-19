/// <reference types= "jest" />

const request = require('supertest');
const app = require('../app');

describe('GET teams', () => {
  it('should get all teams', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('text/html');
  });
});
describe('GET a team by ID', () => {
  test('get team with ID = 57', async () => {
    const res = await request(app).get('/teams/57');

    expect(res.statusCode).toBe(200);
  });
  test('not get a team with invalid ID', async () => {
    const res = await request(app).get('/teams/57K9');

    expect(res.statusCode).toBe(404);
  });
});
