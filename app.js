const express = require("express");
const app = express();

const port = 4000;

const connection = require("./db");

const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const path = require("path");
app.use("/public", express.static(path.join(__dirname, "public")));

const session = require("express-session");
const mysqlStore = require("express-mysql-session")(session);

const sessionStore = new mysqlStore(
  {
    expiration: 259200000,
    clearExpired: true,
    createDatabaseTable: false,
    schema: {
      tableName: "sessions",
      columnNames: {
        session_id: "session_id",
        expires: "expires",
        data: "data",
      },
    },
  },
  connection
);

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      sameSite: true,
      httpOnly: true,
      maxAge: 120000,
    },
  })
);

const expresshbs = require("express-handlebars");
const handlebars = expresshbs.create({ extname: ".hbs" });
app.engine(".hbs", handlebars.engine);
app.set("view engine", ".hbs");

const index_Route = require("./routes/index.routes");
const auth_Route = require("./routes/auth.routes");

app.use("/", index_Route);
app.use("/", auth_Route);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

module.exports = app;
