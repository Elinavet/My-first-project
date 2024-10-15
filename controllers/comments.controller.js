const { fetchCommentsByArticleId, addCommentToArticle } = require('../models/comments.model');

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    
    fetchCommentsByArticleId(article_id)
        .then((comments) => {
            res.status(200).send({ comments });
        })
        .catch(next); 
};

exports.postCommentToArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  if (!username || !body) {
      return res.status(400).send({ msg: "Please provide both username and body in your request." });
  }

  addCommentToArticle(article_id, { username, body })
      .then((comment) => {
          res.status(201).send({ comment });
      })
      .catch((err) => {
          next(err);
      });
};