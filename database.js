require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.DB_CON;
const client = new MongoClient(uri);

let db = null;
let users = null;
let todos = null;

async function connectToDB() {
    db = client.db('Done');
    users = db.collection('users');
    todos = db.collection('todos');
}

async function getTodosForUser(mail) {

}

async function addTodo(mail) {
    
}

async function removeTodo(mail){
    
}

async function findUser(mail) {
    return await users.findOne({ mail: mail });
}

async function addUser(user) {
    user.createdAt = new Date();
    return await users.insertOne(user);
}

connectToDB().catch(error => {
    console.error(error);
    process.exit(1);
});

module.exports = {
    user: {
        findUser,
        addUser
    },
    todos: {
        getTodosForUser,
        addTodo,
        removeTodo
    }
}