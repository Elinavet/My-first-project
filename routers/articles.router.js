const express = require('express');
const { getAllArticles, getArticleById, patchArticleById } = require('../controllers/articles.controller');
const { postCommentToArticle, getCommentsByArticleId } = require('../controllers/comments.controller'); 
const articlesRouter = express.Router();

articlesRouter.get('/', getAllArticles);
articlesRouter.get('/:article_id', getArticleById);
articlesRouter.get('/:article_id/comments', getCommentsByArticleId);
articlesRouter.post('/:article_id/comments', postCommentToArticle);
articlesRouter.patch('/:article_id', patchArticleById);

module.exports = articlesRouter;
