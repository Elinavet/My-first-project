const { fetchCommentsByArticleId, addCommentToArticle, removeCommentById, updateCommentVotes } = require('../models/comments.model');

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

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;

    removeCommentById(comment_id)
        .then(() => {
            res.status(204).send(); 
        })
        .catch(next);
};

exports.patchCommentVotes = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;

    if (typeof inc_votes !== 'number') {
        return res.status(400).send({ msg: 'Invalid input for votes' });
    }

    updateCommentVotes(comment_id, inc_votes)
        .then((updatedComment) => {
            if (!updatedComment) {
                return res.status(404).send({ msg: 'Comment not found' });
            }
            res.status(200).send({ comment: updatedComment });
        })
        .catch(next);
};