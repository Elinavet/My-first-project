const { fetchArticleById } = require('../models/articles.model');

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