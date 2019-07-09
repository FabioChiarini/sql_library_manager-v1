const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const routes = require("./routes/index");
const books = require("./routes/books");

//set static and views paths
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

//set view engine to use pug for template
app.set("view engine", "pug");

app.use("/", routes);
app.use("/books", books);

// setup error handling for 404 error
app.use((req, res, next) => {
  const err = new Error("PAGE NOT FOUND!!");
  err.status = 404;
  next(err);
});

app.listen(3000, () => {
  console.log("Running on localhost:3000");
});
