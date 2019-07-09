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

router.post("/new", (req, res, next) => {
  Book.create(req.body).then(function(book) {
    res.redirect("/books/" + book.id + "/edit");
  });
});

router.get("/:id/edit", (req, res) => {
  Book.findByPk(req.params.id).then(book => {
    res.render("book_details", { book: book });
  });
});

router.put("/:id", (req, res, next) => {
  Book.findByPk(req.params.id)
    .then(book => {
      return book.update(req.body);
    })
    .then(book => {
      res.redirect("book_details", { book: book });
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
