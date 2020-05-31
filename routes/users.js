const express = require("express");
const router = express.Router();

//Login page
router.get("/login", (req, res) => res.render("login"));

//Register page
router.get("/register", (req, res) => res.render("register"));

//Register Handle
router.post("/register", (req, res) => {
  const { name, email, password, passwordTwo } = req.body;

  let errors = [];

  //Check required fields
  if (!name || !email || !password || !passwordTwo) {
    errors.push({ msg: "Make sure to fill all fields" });
  }

  //Passwords match?
  if (password != passwordTwo) {
    errors.push({ msg: "Both passwords are not matching" });
  }

  //Check the pass length
  if (password.length < 6) {
    errors.push({ msg: "Your password must have at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      passwordTwo,
    });
  } else {
    res.send("pass");
  }
});

module.exports = router;
