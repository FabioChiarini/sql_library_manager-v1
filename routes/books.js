const express = require("express");
const router = express.Router();
var Book = require("../models").Book;

/* "home" route, where al books are displayed */
router.get("/", (req, res) => {
  Book.findAll().then(function(books) {
    res.render("index", { books: books });
  });
});

/* route that let the user insert other books and then displays the inserted book */
router.get("/new", (req, res, next) => {
  res.render("new_book", { book: Book.build() });
});

router.post("/new", (req, res, next) => {
  Book.create(req.body).then(function(book) {
    res.redirect("/books/" + book.id + "/edit");
  });
});

/* route to edit exiting books */
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
    }).catch( err => {
      if(err.name === "SequelizeValidationError") {
        var book = Book.build(req.body);
        book.id = req.params.id;

        res.render("/:id/edit", {
          book: book,
          errors: err.errors
        });
      } else {
        throw err;
      }
    }).catch(err => {
      res.send(500);
    });
});


/* route to delete existing books */
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
