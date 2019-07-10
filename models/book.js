"use strict";
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define(
    "Book",
    {
      title: { 
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "TITLE IS REQUIRED"
          }
        },
      },
      author: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "AUTHOR IS REQUIRED"
          }
        },
      },
      genre: DataTypes.STRING,
      year: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: {
            msg: "YEAR SHOULD BE AN INTEGER"
          }
        },
      }
    },
  );
  Book.associate = function(models) {
    // associations can be defined here
  };
  return Book;
};
