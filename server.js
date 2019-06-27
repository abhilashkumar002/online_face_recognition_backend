const express = require('express');

const user = 
  {
    name : "john",
    email : "ajfbhak@jga.com"
  }
const app = express();
app.get('/user',(req,res) => {
  res.send(JSON.stringify(user));
})
app.listen(3000);