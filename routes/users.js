const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

//User model
const User = require("../models/User");

// Login Page
router.get("/login", (req, res) => res.render("login"));

// Register Page
router.get("/register", (req, res) => res.render("register"));

// Register
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    // Validation successful
    User.findOne({ email: email }).then((user) => {
      if (user) {
        //User exists
        errors.push({ msg: "This email is already taken" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });

        //Hashing pass
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            // Password -> Hash
            newUser.password = hash;

            // Saving user
            newUser
              .save()
              .then((user) => {
                res.redirect("/login");
              })
              .catch((err) => console.log(err));
          })
        );
      }
    });
  }
});

module.exports = router;
