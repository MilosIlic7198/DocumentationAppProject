const express = require("express");
const router = express.Router();

const connection = require("../db");

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const check_Auth_Middleware = require("../middleware/check_Auth");
const already_Auth_Middleware = require("../middleware/already_Auth");

router.get("/", already_Auth_Middleware, (req, res) => {
  res.render("index", { front_Page: true });
});

router.get("/release", check_Auth_Middleware, (req, res) => {
  res.render("release_Docs", { release_Docs_Page: true });
});

router.post(
  "/release",
  check_Auth_Middleware,
  upload.single("document"),
  (req, res) => {
    console.log(req.file);
    console.log(req.body.description);

    const name = req.file.originalname;
    const description = req.body.description;
    const type = req.file.mimetype;
    const size = req.file.size;
    const file = req.file.buffer;

    connection.query(
      "INSERT INTO docs (name,type,size,description,data) VALUES (?,?,?,?,?);",
      [name, type, size, description, file],
      function (err, result, fields) {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
        }
      }
    );
  }
);

router.get("/remove", check_Auth_Middleware, (req, res) => {
  res.render("remove_Docs", { remove_Docs_Page: true });
});

router.get("/docs", already_Auth_Middleware, (req, res) => {
  connection.query("SELECT * FROM docs;", function (err, result, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.render("index", { docs_Page: true, files: result });
    }
  });
});

router.get("/docs/:id", already_Auth_Middleware, (req, res) => {
  const id = req.params.id;
  console.log(id);

  connection.query(
    "SELECT * FROM docs WHERE docs_id = ?;",
    [id],
    function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        res.send(result[0].data);
      }
    }
  );
});

router.get("/about", already_Auth_Middleware, (req, res) => {
  res.render("index", { about_Page: true });
});

module.exports = router;
