const request = require('supertest')
const app = require('../app')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/development-data/index')
require('jest-sorted'); 


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

describe('GET /api/articles/:article_id', () => {
    test('responds with 200 and the correct article object for a valid article_id', () => {
        return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toHaveProperty('article_id', 1);
                expect(body.article).toHaveProperty('author');
                expect(body.article).toHaveProperty('title');
                expect(body.article).toHaveProperty('body');
                expect(body.article).toHaveProperty('topic');
                expect(body.article).toHaveProperty('created_at');
                expect(body.article).toHaveProperty('votes');
                expect(body.article).toHaveProperty('article_img_url');
            });
    });

    test('responds with 404 for a non-existent article_id', () => {
        return request(app)
            .get('/api/articles/9999')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Article not found');
            });
    });

    test('responds with 400 for an invalid article_id', () => {
        return request(app)
            .get('/api/articles/invalidID')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid article ID');
            });
    });
});

describe('GET /api/articles', () => {
    test('responds with status 200 and an array of articles sorted by date', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                expect(articles).toBeInstanceOf(Array);
                expect(articles.length).toBeGreaterThan(0);

                articles.forEach((article) => {
                    expect(article).toHaveProperty('author');
                    expect(article).toHaveProperty('title');
                    expect(article).toHaveProperty('article_id');
                    expect(article).toHaveProperty('topic');
                    expect(article).toHaveProperty('created_at');
                    expect(article).toHaveProperty('votes');
                    expect(article).toHaveProperty('article_img_url');
                    expect(article).toHaveProperty('comment_count');
                    expect(article).not.toHaveProperty('body');  
                });

                expect(articles).toBeSortedBy('created_at', { descending: true });
            });
    });
});

describe('GET /api/articles/:article_id/comments', () => {
    test('200: responds with an array of comments with the correct properties', () => {
        return request(app)
            .get('/api/articles/1/comments') 
            .expect(200)
            .then(({ body }) => {
                expect(body.comments).toBeInstanceOf(Array);
                body.comments.forEach((comment) => {
                    expect(comment).toHaveProperty('comment_id');
                    expect(comment).toHaveProperty('votes');
                    expect(comment).toHaveProperty('created_at');
                    expect(comment).toHaveProperty('author');
                    expect(comment).toHaveProperty('body');
                    expect(comment).toHaveProperty('article_id'); 
                });
            });
    });
    test('200: responds with an empty array when the article exists but has no comments', () => {
        return request(app)
            .get('/api/articles/37/comments') 
            .expect(200)
            .then(({ body }) => {
                expect(body.comments).toBeInstanceOf(Array);
                expect(body.comments.length).toBe(0); 
            });
    });

    test('404: responds with "Article not found" for a non-existent article_id', () => {
        return request(app)
            .get('/api/articles/9999/comments')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Article not found');
            });
    });

    test('400: responds with "Invalid article ID" for an invalid article_id', () => {
        return request(app)
            .get('/api/articles/invalidID/comments')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid article ID');
            });
    });
});