const express = require('express');
const router = express.Router();
const pg = require('pg');

// const pool = require('../modules/pool');


const url = require('url');

const Pool = pg.Pool;

let config = {};

if (process.env.DATABASE_URL) {

  const params = url.parse(process.env.DATABASE_URL);
  const auth = params.auth.split(':');

  config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true,
    max: 10,
    idleTimeoutMillis: 30000,
  };
} else {
  config = {
    database: 'weekend-to-do-app',
    host: 'localhost',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000
  };
}

const pool = new Pool(config);





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