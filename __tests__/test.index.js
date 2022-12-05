/// <reference types= "jest" />
const request = require('supertest');
const { app, server } = require('../index');

describe('GET teams', () => {
  it('should return all the teams', async () => {
    const res = await request(app).get('/');

    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('text/html');
  });
});

describe('GET teams with wrong path', () => {
  it('should not return all the teams', async () => {
    const res = await request(app).get('/a');

    expect(res.statusCode).toBe(404);
    expect(res.type).toBe('text/html');
  });
});

afterAll(() => {
  server.close();
});
