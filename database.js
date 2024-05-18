require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = process.env.DB_CON;
const client = new MongoClient(uri);

let db = null;
let users = null;
let todos = null;

async function connectToDB() {
    db = client.db('Done');
    users = db.collection('users');
    todos = db.collection('todos');
    await db.command({ ping: 1 });
    console.log("Pinged DB successfully, connected to MongoDB!");
}

async function getTodosForUser(mail) {
    return await todos.find({mail: mail}).toArray();
}

async function addTodo(todo) {
    return await todos.insertOne(todo);
}

async function removeTodos(mail, ids) {
    let idOb = [];
    ids.forEach((i) => idOb.push(ObjectId.createFromHexString(i))); // create ObjectId array
    return await todos.deleteMany({mail: mail, _id: { $in: idOb } });
}

async function setDone(ids){
    
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
        removeTodos
    }
}