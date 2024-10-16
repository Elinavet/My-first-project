const db = require('../db/connection'); 

exports.fetchArticleById = (article_id) => {
  return db
      .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
      .then((result) => {
          return result.rows[0]; 
      });
};

exports.fetchArticles = ({ sort_by = 'created_at', order = 'desc', topic }) => {
    const validSortColumns = ['title', 'author', 'created_at', 'votes', 'topic'];
    const validOrders = ['asc', 'desc'];
  
    if (!validSortColumns.includes(sort_by) || !validOrders.includes(order)) {
      return Promise.reject({ status: 400, msg: 'Invalid sort query' });
    }
    let queryStr = `
      SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
      COUNT(comments.comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
    `;
    
    const queryValues = [];
    
    if (topic) {
      queryStr += ` WHERE articles.topic = $1`;
      queryValues.push(topic);
    }
    
    queryStr += `
      GROUP BY articles.article_id
      ORDER BY ${sort_by} ${order};
    `;
    
    return db.query(queryStr, queryValues)
    .then((result) => {
      if (result.rows.length === 0 && topic) {
        return Promise.reject({ status: 404, msg: 'Topic not found' });
      }
      return result.rows;
    });
};

  exports.updateArticleVotes = (article_id, inc_votes) => {
    return db
        .query(
            `UPDATE articles 
             SET votes = votes + $1
             WHERE article_id = $2
             RETURNING *;`,
            [inc_votes, article_id]
        )
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Article not found' });
            }
            return result.rows[0];
        });
};