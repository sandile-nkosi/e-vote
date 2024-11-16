const express = require("express");
const sharedController = require("../controllers/shared.controller");
const sharedRouter = express.Router();

//get routes
sharedRouter.get("/", sharedController.getIndex);

sharedRouter.get("/401", (req, res) => {
  res.status(401).render("shared/401");
});

sharedRouter.get("/403", (req, res) => {
  res.status(403).render("shared/403");
});

module.exports = sharedRouter;
