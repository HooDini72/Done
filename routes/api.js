require('dotenv').config();
const express = require('express');
const router = express.Router();
const db = require('../database');

//Todo add to functions
function isLoggedIn(req, res, next) {
  if (!req.jwtProvided) {
    console.log("Denied: Authentication required");
    return res.status(401).send('Authentication required');
  } else if (req.jwtVerifyError || req.jwtExpired) {
    console.log("Denied: Invalid authentication token");
    return res.status(401).send('Invalid authentication token');
  }
  next();
}

router.get('/get/todos/:mail', isLoggedIn, async (req, res) => {
  const {mail} = req.params;
  try {
    res.json(await db.todos.getTodosForUser(mail));
  } catch (error) {
    res.status(500).send('Error getting todos');
    console.error(error)
  }
});


router.post('/add/todo/:mail', isLoggedIn, async (req, res) => {
  const { todo } = req.body;

  if (todo === undefined ||
    todo.mail === undefined ||
    todo.name === undefined ||
    todo.deadline === undefined ||
    todo.importance === undefined ||
    todo.done === undefined) {
    return res.status(400).send("Missing information");
  }

  try {
    res.json(await db.todos.addTodo(todo));
  } catch (error) {
    res.status(500).send('Error add todo');
    console.error(error)
  }
});

router.delete('/remove/todos/:mail',isLoggedIn, async (req, res) => {
    const {ids} = req.body;
    const {mail} = req.params;
    if(ids === undefined || mail === undefined){
      return res.status(400).send("Missing information");
    }
    res.json(await db.todos.removeTodos(mail, ids));
});

router.post('/set/done/:mail',isLoggedIn, async (req, res) =>{ 
    const {id, value} = req.body;
    const {mail} = req.params;
    console.log(id);
    console.log(value);
    if(id === undefined || mail === undefined || value === undefined){
      return res.status(400).send("Missing information");
    }
    res.json(await db.todos.setDone(mail, id, value));
});

module.exports = router;