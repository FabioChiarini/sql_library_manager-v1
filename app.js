const express = require("express");

const app = express();

const routes = require('./routes');
const books = require('./routes/books');

//set view engine to use pug for template
app.set("view engine", "pug");


app.use('/', routes);
app.use('/books', books);


// setup error handling for 404 error
app.use((req, res, next) => {
  const err = new Error('PAGE NOT FOUND!!');
  err.status = 404;
  next(err);
});


app.listen(3000, () => {
  console.log("Running on localhost:3000");
});

