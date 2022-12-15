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
