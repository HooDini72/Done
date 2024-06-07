# Done (Full-Stack Project - JKU)

Done is a small ToDo-Manager. 

## Install Dependence:
```bash
npm install
```

## Start Backend
```bash
npm run start
```

## URLs
```
http://localhost:3000/
http://localhost:3000/login
```



# How to setup Done

## Put the following in a .env-file
```.env
ACCESS_TOKEN_SECRET=123456789
DB_CON=mongodb+srv://SomeString.mongodb.net/...
```
Note: Database (DB_CON) and ACCESS_TOKEN_SECRET for JWT is not included!


## How to  generate a ACCESS_TOKEN_SECRET
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```


## Database (MongoDB)
```
Database: Done
Collections: todos, users
```