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

router.post("/:id/edit", (req, res, next) => {
  Book.findByPk(req.params.id)
    .then(book => {
      return book.update(req.body);
    })
    .then(book => {
      res.redirect("/");
    });
});


router.get("/:id/delete", (req, res, next) => {
  Book.findByPk(req.params.id).then(book => {
    res.render("book_details", { book: book });
  });
})



router.post("/:id/delete", (req, res, next) => {
  Book.findByPk(req.params.id).then(book => {
    return book.destroy();
  }).then(()=> {
    res.redirect("/");
  });
})


module.exports = router;
