const express = require('express');
const { getAllTopics } = require('./controllers/topics.controller');
const { getArticleById } = require('./controllers/articles.controller');
const endpoints = require('./endpoints.json');

const app = express();


app.get('/api/topics', getAllTopics);
app.get('/api', (req, res) => {
    res.status(200).send(endpoints);
});
app.get('/api/articles/:article_id', getArticleById);


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