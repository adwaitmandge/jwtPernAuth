const router = require("express").Router();
const pool = require("../db");
const authorise = require("../middleware/authorisation");

router.get("/", authorise, async (req, res) => {
  try {
    //AFTER PASSING THE MIDDLEWARE, REQ.USER HAS THE PAYLOAD
    console.log("inside");
    console.log(req.user);
    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      req.user,
    ]);
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(403).json("NOT AUTHORISED");
  }
});

module.exports = router;
