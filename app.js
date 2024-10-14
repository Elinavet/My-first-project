const express = require('express');
const { getAllTopics } = require('./controllers/topics.controller');
const app = express();


app.get('/api/topics', getAllTopics);

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
