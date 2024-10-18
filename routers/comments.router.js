const express = require('express');
const { deleteCommentById, patchCommentVotes } = require('../controllers/comments.controller');
const commentsRouter = express.Router();

commentsRouter.delete('/:comment_id', deleteCommentById);
commentsRouter.patch('/:comment_id', patchCommentVotes);

module.exports = commentsRouter;
