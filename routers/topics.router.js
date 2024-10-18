const express = require('express');
const { getAllTopics } = require('../controllers/topics.controller');
const topicsRouter = express.Router();

topicsRouter.get('/', getAllTopics);

module.exports = topicsRouter;
