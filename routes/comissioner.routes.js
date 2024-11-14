const express = require("express");
const comissionerController = require("../controllers/comissioner.controller");
const comissionerRouter = express.Router();
const imageUploadMiddleware = require("../middleware/image-upload");

//get routes
comissionerRouter.get("/login", comissionerController.getLogin);
comissionerRouter.get("/candidates", comissionerController.getCandidates);
comissionerRouter.get("/candidates/new", comissionerController.getNewCandidate);
comissionerRouter.get(
  "/candidates/update/:id",
  comissionerController.getUpdateCandidate
);
comissionerRouter.get("/elections", comissionerController.getElections);

//post routes
comissionerRouter.post("/login", comissionerController.login);

comissionerRouter.post("/logout", comissionerController.logout);

comissionerRouter.post(
  "/candidates/new",
  imageUploadMiddleware,
  comissionerController.createNewCandidate
);

comissionerRouter.post(
  "/candidates/update/:id",
  imageUploadMiddleware,
  comissionerController.updateCandidate
);

comissionerRouter.delete(
  "/candidates/delete/:id",
  comissionerController.deleteCandidate
);

module.exports = comissionerRouter;
