const express = require("express");
const app = express();
const cors = require("cors");
const registerRoutes = require("./routes/register");
const dashboardRoute = require("./routes/dashboard");

app.use(cors());
app.use(express.json());

//Register and login Routes
app.use("/auth", registerRoutes);

//Dashboard Route
app.use("/dashboard", dashboardRoute);

app.listen("3000", () => {
  console.log("ON PORT 3000");
});
