const express = require('express');
const { deleteCommentById } = require('../controllers/comments.controller');
const commentsRouter = express.Router();

commentsRouter.delete('/:comment_id', deleteCommentById);

module.exports = commentsRouter;
