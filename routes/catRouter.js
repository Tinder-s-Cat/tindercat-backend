const express = require("express");
const catRouter = express.Router();
const catController = require("../controller/catController");
const authentication = require("../Middlewares/authentication");
const authorization = require("../Middlewares/authorization");



catRouter.use(authentication);
catRouter.get("/", catController.getCats);
catRouter.get("/:id",  catController.getCatsById);


catRouter.post("/", catController.postCats);
// catRouter.use(authorization);
catRouter.put("/:id", authorization, catController.putCats);
catRouter.patch("/:id", authorization, catController.patchCats);
catRouter.delete("/:id", authorization, catController.deleteCats);

module.exports = catRouter;
