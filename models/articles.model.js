const db = require('../db/connection'); 

exports.fetchArticleById = (article_id) => {
  return db
      .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
      .then((result) => {
        console.log(result)
          return result.rows[0]; 
      });
};

exports.fetchArticles = ({ sort_by = 'created_at', order = 'desc' }) => {
    const validSortColumns = ['title', 'author', 'created_at', 'votes'];
    const validOrders = ['asc', 'desc'];
  
    if (!validSortColumns.includes(sort_by) || !validOrders.includes(order)) {
      return Promise.reject({ status: 400, msg: 'Invalid sort query' });
    }
  
    return db.query(
      `
      SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
      COUNT(comments.comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY ${sort_by} ${order};
      `
    )
    .then((result) => {
      return result.rows;
    });
  };