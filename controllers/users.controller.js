const { fetchAllUsers,fetchUserByUsername } = require('../models/users.model');

exports.getAllUsers = (req, res, next) => {
    fetchAllUsers()
        .then((users) => {
            res.status(200).send({ users });
        })
        .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
    const { username } = req.params;
    const validUsernamePattern = /^[a-zA-Z0-9_]+$/;
    if (!validUsernamePattern.test(username)) {
        return res.status(400).send({ msg: 'Invalid username' });
    }

    fetchUserByUsername(username)
        .then((user) => {
            if (!user) {
                return res.status(404).send({ msg: 'User not found' });
            }
            res.status(200).send({ user });
        })
        .catch((err) => {
            if (err.code === '22P02') { 
                res.status(400).send({ msg: 'Invalid username' });
            } else {
                next(err); 
            }
        });
};