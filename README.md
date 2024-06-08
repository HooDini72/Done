# Done (Full-Stack Project - JKU)

Done is a small ToDo-Manager. 

# How to setup Done

Note: you need nodeJS!

## Install Dependence:
```bash
npm install
```

Create a file ".env" in your projekt (./Done/)
## Put the following in a .env-file (the values in the example are placeholder!)
```.env
ACCESS_TOKEN_SECRET=123456789
DB_CON=mongodb+srv://SomeString.mongodb.net/...
```
Note: Database (DB_CON) and ACCESS_TOKEN_SECRET for JWT is not included!


## How to  generate a ACCESS_TOKEN_SECRET
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the generated token in the .env-File as the value for ACCESS_TOKEN_SECRET.

## Database (MongoDB)
```
Database: Done
Collections: todos, users
```
Copy the connection link in the .env-File as the value for DB_CON.

## Start Backend 
```bash
npm run start
```

## URLs
```
Mainpage: http://localhost:3000/
Login/Register: http://localhost:3000/login
```


