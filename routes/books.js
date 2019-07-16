const express = require("express");
const router = express.Router();
var Book = require("../models").Book;

let books_per_page = 5;

router.get("/", (req, res) => {
  res.redirect("books/1");
});


/* "home" route, where al books are displayed */
router.get("/:page", (req, res) => {
  Book.findAll({ order: [["createdAt", "DESC"]], limit: books_per_page, offset: 3 }).then(function(books) {
    res.render("index", { books: books });
  }).catch(err => {
    err.status = 500;
    next(err);
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
      err.status = 500;
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
        err.status = 500;
        next(err);
      }
    })
    .catch(err => {
      err.status = 500;
      next(err);
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
        err.status = 500;
        next(err);
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
        err.status = 500;
        next(err);
      }
    })
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      err.status = 500;
      next(err);
    });
});

module.exports = router;
