const db = require('../db/connection'); 

exports.fetchArticleById = (article_id) => {
  return db
      .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
      .then((result) => {
        console.log(result)
          return result.rows[0]; 
      });
};