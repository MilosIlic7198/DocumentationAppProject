const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "documentationappproject",
});

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("You have connected to the database!");
  }
});

module.exports = connection;
