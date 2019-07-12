const express = require("express");
const router = express.Router();
var Book = require("../models").Book;

/* "home" route, where al books are displayed */
router.get("/", (req, res) => {
  Book.findAll({ order: [["createdAt", "DESC"]] }).then(function(books) {
    res.render("index", { books: books });
  });
});

/* route that let the user insert other books and then displays the inserted book */
router.get("/new", (req, res, next) => {
  res.render("new_book", { book: Book.build() });
});

router.post("/new", (req, res, next) => {
  Book.create(req.body)
    .then(function(book) {
      res.redirect("/books/" + book.id + "/edit");
    })
    .catch(err => {
      if (err.name === "SequelizeValidationError") {
        var book = Book.build(req.body);
        book.id = req.params.id;

        res.render("new_book", {
          book: book,
          errors: err.errors
        });
      } else {
        throw err;
      }
    })
    .catch(err => {
      res.sendStatus(500);
    });
});

/* route to edit exiting books */
router.get("/:id/edit", (req, res, next) => {
  Book.findByPk(req.params.id)
    .then(book => {
      if (book) {
        res.render("book_details", { book: book });
      } else {
        const err = new Error();
        next(err);
      }
    })
    .catch(err => {
      err.sendStatus(500);
    });
});

router.post("/:id/edit", (req, res, next) => {
  Book.findByPk(req.params.id)
    .then(book => {
      return book.update(req.body);
    })
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      if (err.name === "SequelizeValidationError") {
        var book = Book.build(req.body);
        book.id = req.params.id;

        res.render("book_details", {
          book: book,
          errors: err.errors
        });
      } else {
        console.log("UNEXPECTED ERROR!!  " + err.status);
        res.render("error");
      }
    });
});

/* route to delete existing books */
router.get("/:id/delete", (req, res, next) => {
  Book.findByPk(req.params.id).then(book => {
    res.render("book_details", { book: book });
  });
});

router.post("/:id/delete", (req, res, next) => {
  Book.findByPk(req.params.id)
    .then(book => {
      if (book) {
        return book.destroy();
      } else {
        res.sendStatus(404);
      }
    })
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      res.sendStatus(500);
    });
});

module.exports = router;
