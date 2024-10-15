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
                    expect(comment).toHaveProperty('comment_id', expect.any(Number));
                    expect(comment).toHaveProperty('votes', expect.any(Number));
                    expect(comment).toHaveProperty('created_at', expect.any(String));
                    expect(comment).toHaveProperty('author', expect.any(String));
                    expect(comment).toHaveProperty('body', expect.any(String));
                    expect(comment).toHaveProperty('article_id', 1); 
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
    test('should respond with comments in descending order by created_at', () => {
        return request(app)
            .get('/api/articles/1/comments') 
            .then((response) => {
                expect(response.status).toBe(200);
                const comments = response.body.comments;

                const sortedComments = [...comments].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                expect(comments).toEqual(sortedComments);
            });
    });
});

describe('POST /api/articles/:article_id/comments', () => {
    test('should add a comment for a valid article_id', () => {
        return request(app)
            .post('/api/articles/1/comments')
            .send({ username: 'weegembump', body: 'This is a comment.' })
            .then((response) => {
                expect(response.status).toBe(201);
                expect(response.body.comment).toHaveProperty('comment_id');
                expect(response.body.comment.author).toBe('weegembump');
                expect(response.body.comment.body).toBe('This is a comment.');
                expect(response.body.comment.article_id).toBe(1);
            });
    });

    test('should respond with 404 for a non-existent article_id', () => {
        return request(app)
            .post('/api/articles/9999/comments') 
            .send({ username: 'weegembump', body: 'This is a comment.' })
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('Article not found');
            });
    });

    test('should respond with 400 for missing fields', () => {
        return request(app)
            .post('/api/articles/1/comments')
            .send({ body: 'This is a comment.' }) 
            .then((response) => {
                expect(response.status).toBe(400);
                expect(response.body.msg).toBe("Please provide both username and body in your request.");
            });
    });
});

describe('PATCH /api/articles/:article_id', () => {
    test('should update the article votes and respond with the updated article', () => {
        return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toEqual(
                    expect.objectContaining({
                        article_id: 1,
                        votes: expect.any(Number),
                    })
                );
            });
    });

    test('should decrement the votes when a negative value is passed', () => {
        return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: -100 })
            .expect(200)
            .then(({ body }) => {
                expect(body.article.votes).toBe(-100); 
            });
    });

    test('should return 400 for an invalid inc_votes (non-numeric)', () => {
        return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: 'invalid' })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid request body');
            });
    });

    test('should return 404 for a non-existent article_id', () => {
        return request(app)
            .patch('/api/articles/9999')
            .send({ inc_votes: 1 })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Article not found');
            });
    });

    test('should return 400 for a missing inc_votes field in request body', () => {
        return request(app)
            .patch('/api/articles/1')
            .send({})
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid request body');
            });
    });
});