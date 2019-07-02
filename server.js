const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const imageProcess = require('./imageProcess');
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.BACKEND_PORT;

const database = {
  users : [
    {
      id : 111,
      name : 'john',
      email : 'john@gmail.com',
      password : "1234321",
      entries : 0,
      joined : new Date()
    },
    {
      id : 112,
      name : 'doe',
      email : 'doe@gmail.com',
      password : "4321234",
      entries : 0,
      joined : new Date()
    }
  ]
}

const app = express();
app.use(cors())
app.use(bodyParser.json());

app.get('/',(req, res) => {
  res.json(database);
})

app.post('/signin', (req, res) => {
  let { email, password } = req.body;
  let found = false;
  database.users.forEach(user => {
    if(email === user.email 
      && password === user.password){
        found = true;
        console.log(user)
        res.json({...user,password:''} );
      }
  })
  if(!found){
      res.status(400).json("error loging in");
  }
})

app.post('/register', (req, res) => {
  const {email, password, name} = req.body;
  if(email && password && name){
    database.users.push({
      id : 113,
      name :name,
      email : email,
      password : password,
      entries : 0,
      joined : new Date()
    });
    res.json({...database.users[database.users.length-1],password:''})
  }
  else{
    res.status(400).json('Invalid input');
  }
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id == id){
      found = true;
      return res.json(user);
    }
  })
  if(!found){
    res.status(400).json("not found");
  }
})

app.put('/image',(req,res)=>{
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if(user.id == id){
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  })
  if(!found){
    res.status(400).json("not found");
  }
})

app.post('/imageAnalysis',(req, res) => {imageProcess.analyseImage(req, res)})

app.listen(PORT, () => {
  console.log(`Server is listening to port ${PORT}`);
});