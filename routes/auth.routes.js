const express = require("express");
const router = express.Router();
const connection = require("../db");
const bcrypt = require("bcrypt");

const check_Auth_Middleware = require("../middleware/check_Auth");
const already_Auth_Middleware = require("../middleware/already_Auth");

router.get("/login", already_Auth_Middleware, (req, res) => {
  res.render("login", { login_Page: true });
});

router.post("/login", already_Auth_Middleware, (req, res) => {
  console.log(req.body);

  const username = req.body.username;
  const password = req.body.password;

  connection.query(
    "SELECT * FROM user WHERE username = ?;",
    [username],
    function (err, result, fields) {
      if (err) {
        res.status(500).json({
          err,
        });
      } else if (result.length == 0) {
        res.status(200).json({
          message: "Invalid username or password!",
        });
      } else {
        bcrypt.compare(password, result[0].password, (err, compare) => {
          if (err) {
            res.status(500).json({
              err,
            });
          } else if (!compare) {
            res.status(200).json({
              message: "Invalid username or password!",
            });
          } else {
            req.session.user = username;
            res.status(200).redirect("/release");
          }
        });
      }
    }
  );
});

router.get("/logout", check_Auth_Middleware, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({
        err,
      });
    } else {
      res.redirect("/");
    }
  });
});

router.get("/register", already_Auth_Middleware, (req, res) => {
  res.render("register", { register_Page: true });
});

router.post("/register", already_Auth_Middleware, (req, res) => {
  console.log(req.body);

  const username = req.body.username;
  const password = req.body.password;

  connection.query(
    "SELECT * FROM user WHERE username = ?;",
    [username],
    function (err, result, fields) {
      if (err) {
        res.status(500).json({
          err,
        });
      } else if (result.length > 0) {
        res.status(200).json({
          message: "This username is taken!",
        });
      } else {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({
              err,
            });
          } else {
            connection.query(
              "INSERT INTO user (username, password) VALUES (?,?);",
              [username, hash],
              function (err, result, fields) {
                if (err) {
                  res.status(500).json({
                    err,
                  });
                } else {
                  res.status(201).redirect("/login");
                }
              }
            );
          }
        });
      }
    }
  );
});

module.exports = router;
