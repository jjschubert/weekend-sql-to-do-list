const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

//delete items
router.delete('/:id', (req, res) => {
    let id = req.params.id;
    console.log('Delete route with id of', id);
    
    let queryText = 
    `DELETE FROM "items"
    WHERE "id" = $1`

    pool.query(queryText, [id]).then((result) => {
        res.sendStatus(204);
      }).catch((error) => { 
        console.log('error in DELETE', error);
        res.sendStatus(500);
      })
    });


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

//add new task to DB 
router.post('/', (req, res) => {
    let newTask = req.body;
    console.log('adding task: ', newTask);

    let queryText = `INSERT INTO "items"("task", "goal")
    VALUES ($1, $2);`;
    pool.query(queryText, [newTask.task, newTask.goal])
    .then(result => {
        res.sendStatus(201);
    }).catch (error => {
        console.log('Error in adding task ', error);
        res.sendStatus(500);
    });
});

router.put('/:id', (req, res) => {
    let task = req.body; //task with updated status
    let id = req.params.id;
    console.log(`updating task ${id} with`, task);
    let queryText = 
    `UPDATE "items"
    SET "status" = 'Done'
    WHERE "id" = $1;`;

    pool.query(queryText, [id]).then((result) => {
        res.sendStatus(200);
    }).catch((error) => {
        console.log('error in PUT', error);
        res.sendStatus(500);
    })
})


module.exports = router;