const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

const validInfo = (req, res, next) => {
  const { username, password, email } = req.body;
  //MISSING CREDENTIALS
  if (req.path === "/register") {
    if (![username, email, password].every(Boolean)) {
      return res.status(401).json("MISSING CREDENTIALS");
    } else if (!validateEmail(email)) {
      return res.status(401).json("INVALID EMAIL");
    }
  } else if (req.path === "/login") {
    if (![email, password].every(Boolean)) {
      return res.status(401).json("MISSING CREDENTIALS");
    } else if (!validateEmail(email)) {
      return res.status(401).json("INVALID EMAIL");
    }
  }
  next();
};

module.exports.validInfo = validInfo;
module.exports.validateEmail = validateEmail;
