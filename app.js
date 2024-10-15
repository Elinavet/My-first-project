const express = require('express');
const { getAllTopics } = require('./controllers/topics.controller');
const { getArticleById, getAllArticles } = require('./controllers/articles.controller');
const { getCommentsByArticleId,postCommentToArticle } = require('./controllers/comments.controller');
const endpoints = require('./endpoints.json');

const app = express();

app.use(express.json())


app.get('/api/topics', getAllTopics);
app.get('/api/articles', getAllArticles);
app.get('/api', (req, res) => {
    res.status(200).send(endpoints);
});
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.post('/api/articles/:article_id/comments', postCommentToArticle);


app.use((req, res, next) => {
    const err = new Error('Path not found');
    err.status = 404;
    next(err); 
});


app.use((err, req, res, next) => {
    
    if (err.status) {
        return res.status(err.status).send({ msg: err.msg || err.message || 'Error' });
    }
    next(err); 
});

app.use((err, req, res, next) => {
    
    if (err.code === '22P02') {
        return res.status(400).send({ msg: 'Invalid article ID' });
    }
    next(err); 
});

app.use((err, req, res, next) => {
    
    console.error(err);
    res.status(500).send({ msg: 'Internal Server Error' });
});

module.exports = app;