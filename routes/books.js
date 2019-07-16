const express = require("express");
const router = express.Router();
var Book = require("../models").Book;
const Op = require("sequelize").Op;

let books_per_page = 5;

// redirect users to first page of results
router.get("/", (req, res) => {
  res.redirect("books/1");
});

/* "home" route, where al books are displayed based on the page number*/
router.get("/:page", (req, res, next) => {
  let books_to_show = [];
  Book.findAndCountAll({
    raw: true,
    limit: books_per_page,
    order: [["createdAt", "DESC"]],
    offset: books_per_page * (req.params.page - 1)
  })
    .then(function(books) {
      // calculate number of pages and populate the respective array
      let number_of_pages = Math.ceil(books.count / books_per_page);
      for (book in books.rows) {
        books_to_show.push(books.rows[book]);
      }
      // check if page requested is in the interval, otherwise throw 404 err
      if (req.params.page <= number_of_pages) {
        res.render("index", { books: books_to_show, pages: number_of_pages });
      } else {
        const err = new Error();
        err.status = 404;
        next(err);
      }
    })
    .catch(err => {
      err.status = 500;
      next(err);
    });
});

router.get("/search/:searched_string/:page", (req, res, next) => {
  let keyword = req.params.searched_string.toLowerCase();

  let books_to_show = [];
  Book.findAndCountAll({
    raw: true,
    where: {
      [Op.or]: [
        {
          title: {
            [Op.like]: `%${keyword}%`
          }
        },
        {
          author: {
            [Op.like]: `%${keyword}%`
          }
        },
        {
          genre: {
            [Op.like]: `%${keyword}%`
          }
        },
        {
          year: {
            [Op.like]: `%${keyword}%`
          }
        }
      ]
    },
    limit: books_per_page,
    order: [["createdAt", "DESC"]],
    offset: books_per_page * (req.params.page - 1)
  })
    .then(function(books) {
      let number_of_pages = Math.ceil(books.count / books_per_page);
      for (book in books.rows) {
        books_to_show.push(books.rows[book]);
      }
      if (books_to_show.length > 0) {
        if (req.params.page <= number_of_pages) {
          res.render("search_results", {
            books: books_to_show,
            pages: number_of_pages,
            keyword: keyword
          });
        } else {
          const err = new Error();
          err.status = 404;
          next(err);
        }
      } else {
        res.render("no_results");
      }
    })
    .catch(err => {
      err.status = 500;
      next(err);
    });
});

router.post("/search", (req, res, next) => {
  res.redirect("/books/search/" + req.body.keyword + "/1");
});

/* route that let the user insert other books and then displays the inserted book */
router.get("/book/new", (req, res, next) => {
  res.render("new_book", { book: Book.build() });
});

router.post("/book/new", (req, res, next) => {
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
