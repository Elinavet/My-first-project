const request = require('supertest')
const app = require('../app')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/development-data/index')


beforeEach(()=> seed(testData))
afterAll(()=>db.end())

describe('GET /api/topics', () => {
  test('responds with an array of topic objects', () => {
      return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({ body }) => {
              expect(body.topics).toBeInstanceOf(Array);
              body.topics.forEach((topic) => {
                  expect(topic).toEqual(
                      expect.objectContaining({
                          slug: expect.any(String),
                          description: expect.any(String),
                      })
                  );
              });
          });
  });

  test('responds with a 404 for an invalid path', () => {
      return request(app)
          .get('/api/nonexistent')
          .expect(404)
          .then(({ body }) => {
              expect(body.msg).toBe('Path not found');
          });
  });
});

describe('GET /api', () => {
  test('responds with a JSON object detailing all available endpoints', () => {
      return request(app)
          .get('/api')
          .expect(200)
          .then(({ body }) => {
              expect(body).toEqual(expect.any(Object));
              expect(body['GET /api']).toEqual({
                  description: 'serves up a json representation of all the available endpoints of the api'
              });
              expect(body['GET /api/topics']).toEqual({
                  description: 'serves an array of all topics',
                  queries: [],
                  exampleResponse: {
                      topics: [
                          { slug: 'football', description: 'Footie!' }
                      ]
                  }
              });
          });
  });
});