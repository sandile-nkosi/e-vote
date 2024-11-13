const express = require("express");
const app = express();
const db = require("./config/database");
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const voterRoutes = require("./routes/auth.routes");
const voteRoutes = require("./routes/vote.routes");
const sharedRoutes = require("./routes/shared.routes");
const errorHandlerMiddleware = require("./middleware/error-handler");
const checkAuthStatusMiddleware = require("./middleware/check-auth");
const session = require('express-session');
const createSessionConfig = require("./config/session")


app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.use(session(createSessionConfig()))
app.use(checkAuthStatusMiddleware);
//routes

//shared routes
app.use("/", sharedRoutes);

//voter routes
app.use("/api/voter", voterRoutes);

//vote routes
app.use("/voter", voteRoutes);

//error handler
app.use(errorHandlerMiddleware);

// connect to database
db()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Failed to connect to the database!");
    console.log(err);
  });
