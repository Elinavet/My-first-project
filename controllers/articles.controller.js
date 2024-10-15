const { fetchArticleById, fetchArticles, updateArticleVotes } = require('../models/articles.model');

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;

    if (isNaN(article_id)) {
        const err = new Error('Invalid article ID');
        err.status = 400; 
        return next(err);
    }

    fetchArticleById(article_id)
        .then((article) => {
            if (!article) {
                const err = new Error('Article not found');
                err.status = 404; 
                return next(err);
            }
            res.status(200).send({ article });
        })
        .catch((err) => {
            next(err); 
        });
};

exports.getAllArticles = (req, res, next) => {
    fetchArticles(req.query)
      .then((articles) => {
        res.status(200).send({ articles });
      })
      .catch(next); 
  };

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    if (!inc_votes || typeof inc_votes !== 'number') {
        return res.status(400).send({ msg: 'Invalid request body' });
    }

    updateArticleVotes(article_id, inc_votes)
        .then((updatedArticle) => {
            res.status(200).send({ article: updatedArticle });
        })
        .catch(next);
};