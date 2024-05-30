require('dotenv').config();
const express = require('express');
const router = express.Router();
const db = require('../database');
var WebSocket = require('ws');

// Web Socket
const wss = new WebSocket.Server({ port: 3002 });
var socketID = 0;

wss.on('connection', (client, req) => {
    console.log(`Clients connected: ${wss.clients.size}`);
   
    client.socketID = socketID;
    socketID++;
    
    client.send(JSON.stringify({type: 'todo', id: "", entity: {socketID: client.socketID}, op: 'reg'}));
    client.on('message', (data, isBinary) => {
        const message = JSON.parse(data);
        if (message.interestedIn) {
            client.interestedIn = message.interestedIn;
            console.log(`WS client switched intrested to ${message.interestedIn}`);
        }
    });

    client.on('close', () => {
        console.log(`WS Client disconnected, now ${wss.clients.size} connected`)
    });
});

function multicast(info, mail, sender) {
    const strInfo = JSON.stringify(info, null, 2);
    console.log(`broadcasting ${strInfo} to clients interested in '${mail}'`);
    for (broadcastTarget of [...wss.clients].filter(c => c.interestedIn === mail)) {
        if (broadcastTarget.readyState === WebSocket.OPEN && broadcastTarget.socketID != sender) {
            broadcastTarget.send(strInfo);
        }
    }
}



// Routs
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
    const { mail } = req.params;
    try {
        res.json(await db.todos.getTodosForUser(mail));
    } catch (error) {
        res.status(500).send('Error getting todos');
        console.error(error)
    }
});


router.post('/add/todo/:mail', isLoggedIn, async (req, res) => {
    const { todo } = req.body;
    const adderID = req.body.socketID;
    if (todo === undefined ||
        todo.mail === undefined ||
        todo.name === undefined ||
        todo.deadline === undefined ||
        todo.importance === undefined ||
        todo.done === undefined ||
        adderID === undefined) {
        return res.status(400).send("Missing information");
    }

    try {
        const newTodo = await db.todos.addTodo(todo);
        multicast({type: 'todo', id: todo.mail, entity: {newTodo: todo, _id: newTodo}, op: 'add'}, todo.mail, adderID);
        res.json(newTodo);
    } catch (error) {
        res.status(500).send('Error add todo');
        console.error(error)
    }
});

router.delete('/remove/todos/:mail', isLoggedIn, async (req, res) => {
    const { ids } = req.body;
    const { mail } = req.params;
    const removerID = req.body.socketID;
    if (ids === undefined || mail === undefined || removerID === undefined) {
        return res.status(400).send("Missing information");
    }
    
    const removed = await db.todos.removeTodos(mail, ids);
    multicast({type: 'todo', id: mail, entity: {ids: ids}, op: 'rem'}, mail, removerID);
    res.json(removed);
});

router.post('/set/done/:mail', isLoggedIn, async (req, res) => {
    const { id, value } = req.body;
    const { mail } = req.params;
    const donerID = req.body.socketID;
    if (id === undefined || mail === undefined || value === undefined) {
        return res.status(400).send("Missing information");
    }
    res.json(await db.todos.setDone(mail, id, value));
    multicast({type: 'todo', id: mail, entity: {id: id, value: value}, op: 'don'}, mail, donerID);
});

module.exports = router;