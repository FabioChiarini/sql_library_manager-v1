const express = require("express");

const app = express();

//set view engine to use pug for template
app.set("view engine", "pug");
app.use("/static", express.static("public"));

app.get("/", (req, res) => {
  res.send("<h1>HOME</h1>");
});

app.get("/books", (req, res) => {
  res.send("<h1>BOOKS</h1>");
});

app.get("/books/new", (req, res) => {
  res.send("<h1>NEW BOOK</h1>");
});

app.get("/books/:id", (req, res) => {
  res.send("<h1>ABC</h1>");
});

app.listen(3000, () => {
  console.log("Running on localhost:3000");
});
