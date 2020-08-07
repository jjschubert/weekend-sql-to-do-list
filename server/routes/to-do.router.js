const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

//get all tasks
router.get('/', (req, res) => {
    let queryText = 'SELECT * FROM "items" ORDER BY "status" DESC;';
    pool.query(queryText).then(result => {
        res.send(result.rows);
    }).catch(error => {
        console.log('error getting tasks', error);
        res.sendStatus(500);
    });
});




module.exports = router;