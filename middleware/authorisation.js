const jwt = require("jsonwebtoken");
require("dotenv").config();

const authorise = async (req, res, next) => {
  try {
    //1. DESTRUCTURE THE TOKEN FROM THE REQUEST HEADER(JWT TOKENS ARE ATTACHED TO THE REQUEST HEADER)
    const token = req.header("jwt-token");
    console.log(token);
    if (!token) {   
      return res.status(403).json("NOT AUTHORISED");
    }

    //jwt.verify returns the decoded payload contained within the token
    const payload = jwt.verify(token, process.env.jwtSecret);
    console.log(payload);
    console.log("I am ", payload.user);
    req.user = payload.user; 
    next();
  } catch (err) {
    console.error(err.message);
    return res.status(403).json("NOT AUTHORISED");
  }
};

module.exports = authorise;
  