const db = require('../db/connection');

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT *
      FROM comments
      WHERE article_id = $1
      ORDER BY created_at DESC;`,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return db
          .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
          .then((articleResult) => {
            if (articleResult.rows.length === 0) {
              return Promise.reject({ status: 404, msg: 'Article not found' });
            } else {
              return []; 
            }
          });
      }
      return result.rows; 
    });
};

exports.addCommentToArticle = (article_id, { username, body }) => {
  return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
      .then((result) => {
          if (result.rows.length === 0) {
              return Promise.reject({ status: 404, msg: 'Article not found' });
          }
          const query = `
              INSERT INTO comments (author, body, article_id)
              VALUES ($1, $2, $3)
              RETURNING *;
          `;
          return db.query(query, [username, body, article_id])
              .then((result) => {
                  return result.rows[0];
              });
      })
};