const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.BACKEND_PORT;
const DBPASS = process.env.DB_PASSWORD;
const imageProcess = require("./imageProcess");

const dbConnection = mysql.createConnection({
  host: "db4free.net",
  user: "root_test_002",
  password: "002testroot",
  database: "mysql_test_data"
});


const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  dbConnection.connect(err => {
    if (err) {
      console.log(err);
    } else {
      dbConnection.query("select * from users", (err, result) => {
        if (err) {
          res.status(400).json({
            status: 400,
            message: "Error connecting to database"
          });
        } else {
          res.json({
            status: 200,
            message: "Connected to database"
          });
        }
      });
    }
  });
});

app.post("/signin", (req, res) => {
  let { email, password } = req.body;
  let sqlQuery =
    "select * from users where email = " +
    mysql.escape(email) +
    "and password = " +
    mysql.escape(password);
  dbConnection.query(sqlQuery, (err, result) => {
    if (err) {
      res.status(404).json("Network error");
    } else {
      if (result.length == 0) {
        res.status(404).json("Wrong email or password.");
      } else {
        res.json(result[0]);
      }
    }
  });
});

app.post("/register", (req, res) => {
  const { email, password, name } = req.body;
  if (email && password && name) {
    const values = [[name, email, password]];
    const sqlQuery = "insert into users (name, email, password) values ?";
    dbConnection.query(sqlQuery, [values], (err, result) => {
      if (err) {
        res.status(400).json("Network error.");
      } else {
        dbConnection.query(
          `select * from users where id = ${result.insertId}`,
          (err, result) => {
            if (err) {
              res
                .status(400)
                .json("User created, error connecting to database");
            } else {
              res.json(result[0]);
            }
          }
        );
      }
    });
  } else {
    res.status(400).json("Invalid input");
  }
});


app.put("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  let sqlQuery = 'select * from users where id = ' + mysql.escape(id);
  dbConnection.query(sqlQuery, (err, result) => {
    if(err){
      res.status(400).json('Network error occured while increasing count.');
    }
    else{
      console.log(result);
      let entries = result[0].entries + 1;
      dbConnection.query(`update users set entries = ${entries} where id = ${id}`,(err, result) => {
        if(err){
          res.json('Network error occured while increasing count');
        }
        else{
          console.log(entries)
          res.json(entries)
        }
      })
    }
  })
});

app.post("/imageAnalysis", (req, res) => {
  imageProcess.analyseImage(req, res);
});

app.listen(PORT, () => {
  console.log(`Server is listening to port ${PORT}`);
});
