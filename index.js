const express = require('express')
const { open } = require("sqlite");
const sqlite3 = require('sqlite3')
const cors = require('cors')
const path = require("path");
const bodyparser = require('body-parser')

const app = express();
app.use(cors())
const dbPath = path.join(__dirname, "goodreads.db");
app.use(express.json());

const inserttable = async () => {

    //   await db.run(`drop table users`)
    // await db.run(`
    // create table users (id integer primary key autoincrement ,username text not null, password text not null)
    
    // `)
    // await db.run(`insert into users (username, password) values ('vamshi','12345678')`)
    await db.run(`DELETE FROM users WHERE id = 6`);
    const res = await db.all('select * from users')
    console.log(res)
}

let db = null;

const initializeDBAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
        app.listen(3300, () => {
            console.log("Server Running at http://localhost:3300/");
        });
        // inserttable()
    }
    catch (e) {
        console.log(`DB Error: ${e.message}`);
        process.exit(1);
    }

};


initializeDBAndServer();



app.post('/login', async (req, res) => {
    const { username, password } = req.body
    console.log(req.body)
    const query = `select * from users where username='${username}'`
    const response = await db.get(query)
    console.log(response)
    if (response === undefined) {
        res.status(404)
        res.send({'error_msg':'user not found'})
        console.log('not found')
    } else {
        if (password === response.password) {
            const userDetails = {
                username: 'rahul',
                password: 'rahul@2021',
              };
              const options = {
                method: "POST",
                body: JSON.stringify(userDetails),
              };
            const getdata = await fetch('https://apis.ccbp.in/login',options)
            const data=await getdata.json();
            res.status(200)
            res.send({'jwt_token':`${data.jwt_token}`})
            console.log(data.jwt_token)
        } else {
            res.status(401)
            res.send({error_msg:'password incorrect'})
        }
    }
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body
    const query = `select * from users where username='${username}'`
    const response = await db.all(query)
    if (response.length <= 0) {
        const que = `insert into users (username,password) values('${username}','${password}')`
        const respons = await db.run(que)
        res.status(200)
        res.send({error_msg:'successfully added'})
    } else {
        res.status(401)
        res.send({error_msg:'Already Registered'})
    }
})


app.get('/', async (req, res) => {
    const response = await db.all(`select * from users`)
    res.send(response)
    console.log(response)
})

