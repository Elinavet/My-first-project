const express = require('express');
const topicsRouter = require('./routers/topics.router');
const articlesRouter = require('./routers/articles.router');
const commentsRouter = require('./routers/comments.router');
const usersRouter = require('./routers/users.router');
const endpoints = require('./endpoints.json');
const cors = require('cors');

const app = express();
app.use(express.json())
app.use(cors());

app.get('/api', (req, res) => {
    res.status(200).send(endpoints);
});

app.use('/api/topics', topicsRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/users', usersRouter);


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
        return res.status(400).send({ msg: 'Invalid ID' });
    }
    next(err); 
});

app.use((err, req, res, next) => {
    
    console.error(err);
    res.status(500).send({ msg: 'Internal Server Error' });
});

module.exports = app;