const express = require("express");
const router = express.Router();
var Book = require("../models").Book;

router.get("/books", (req, res) => {
    Book.findAll().then(function(books) {
      res.render("index", { books: books });
    });
  });

  