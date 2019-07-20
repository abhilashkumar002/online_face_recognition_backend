const mysql = require('mysql');

const connection = mysql.createConnection({
  host:"db4free.net",
  user:'root_test_002',
  password:'002testroot',
  database:'mysql_test_data'
})

connection.connect((err) => {
  if(err){
    console.log(err)
  }
  else{
    const qry = 'alter table users add unique (email)';
    connection.query(qry,
    (err, result) => {
      if(err){
        console.log(err)
      }
      else{
        console.log(result)
      }
    })
  }
})