const express = require("express");
const router = express.Router();
var Book = require("../models").Book;

router.get("/", (req, res) => {
  Book.findAll().then(function(books) {
    res.render("index", { books: books });
  });
});

router.get("/new", (req, res, next) => {
  res.render("new_book", { book: Book.build() });
});

router.post("/", (req, res, next) => {
  Book.create(req.body).then(function(book) {
    res.redirect("/:" + book.id);
  });
});

router.get("/:id", (req, res) => {
  Book.findByPk(req.params.id).then(books => {
    res.render("book_details", { books: books });
  });
});

/*
router.put("/:id", function(req, res, next) {
  var book = find(req.params.id);
  book.title = req.body.title;
  book.author = req.body.author;
  book.genre = req.body.genre;
  book.year = req.body.year;

  res.redirect("/books/" + book.id);
});*/

module.exports = router;
