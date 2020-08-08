const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');


router.put('/:id', (req, res) => {
    let item = req.body;
    let id = req.params.id;
    let values = [item.task, item.goal, item.completion, id]

    console.log(`updating item ${id} with `, item);
    
    let queryText = 
        `UPDATE "items"
        SET "task" = $1, "goal" = $2, "completion" = $3
        WHERE "id" = $4;`;

        pool.query(queryText, values).then((result) => {
            res.sendStatus(200);
        }).catch((error) => {
            console.log('error in edit PUT', error);
            res.sendStatus(500);
        })
});


module.exports = router;