const db = require('../db/connection');

exports.fetchAllUsers = () => {
    return db.query(`
        SELECT username, name, avatar_url
        FROM users;
    `)
    .then((result) => {
        return result.rows;
    });
};

exports.fetchUserByUsername = (username) => {
    return db.query(
        `SELECT username, avatar_url, name FROM users WHERE username = $1;`,
        [username]
    ).then((result) => {
        return result.rows[0]; 
    });
};