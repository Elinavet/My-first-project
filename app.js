const express = require('express');
const { getAllTopics } = require('./controllers/topics.controller');
const app = express();
const endpoints = require('./endpoints.json')


app.get('/api/topics', getAllTopics);

app.get('/api', (req, res, next) => {
    res.status(200).send(endpoints);
});

app.use((req, res, next) => {
    res.status(404).send({ msg: 'Path not found' });
});

app.use((err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        console.error(err);
        res.status(500).send({ msg: 'Internal Server Error' });
    }
});

module.exports = app;
