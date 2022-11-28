const express = require("express");
const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const { validInfo, validateEmail } = require("../middleware/validInfo");
const { application } = require("express");
const authorise = require("../middleware/authorisation");

router.use(express.json());

router.post("/register", validInfo, async (req, res) => {
  try {
    //1. DESTRUCTURE THE REQ.BODY (username, email, password)
    const { username, password, email } = req.body;
    console.log(username, password, email);

    const newUser = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    // 2. CHECK IF THE USER EXISTS
    if (newUser.rows.length > 0) {
      console.log("HI!!");
      return res.status(401).send("User already exists");
    } else {
      //3. BCRYPT THE USER PASSWORD
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      //4. INSERT THE NEW USER INSIDE THE DATABASE
      const newUser = await pool.query(
        "insert into users(username, password, email) values($1, $2, $3) returning *",
        [username, hashedPassword, email]
      );
      //5. GENERATING OUR JWT TOKEN
      const token = jwtGenerator(newUser.rows[0].user_id);
      return res.json(token);
    }
  } catch (err) {
    console.error("SERVER ERROR");
    res.status(500).send(err.message);
  }
});

router.post("/login", validInfo, async (req, res) => {
  try {
    //1. DESTRUCTURE FROM REQ.BODY
    const { email, password } = req.body;
    console.log(email, password);
    const foundUser = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    //2. CHECK IF THE USER EXISTS
    if (foundUser.rows.length === 0) {
      //3. THROW ERROR IF THE USER DOES NOT EXIST
      return res.status(401).json("INVALID CREDENTIALS");
    } else {
      //4. CHECK IF THE PASSWORD ENTERED IS RIGHT
      const validPassword = await bcrypt.compare(
        password,
        foundUser.rows[0].password
      );
      //5. GENERATE A TOKEN IF THE PASSWORD ENTERED IS RIGHT
      if (validPassword) {
        const token = jwtGenerator(foundUser.rows[0].user_id);
        console.log("SUCCESS!!!");
        return res.json({ token });
      }
      throw new Error("INVALID CREDENTIALS")
    }
  } catch (err) {
    res.status(500).send("SERVER ERROR");
    console.error(err);
  }
});

//We have generated a jwt token and have sent it to the client side and so everytime they make a fetch or access request to get access to a private area they are going to have to show that token to us and now we need to create a middleware that will check whether or not the token that is given to us is valid

router.get("/is-verify", authorise, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
