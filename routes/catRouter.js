const express = require("express");
const catRouter = express.Router();
const catController = require("../controller/catController");
const authentication = require("../Middlewares/authentication");
// const {authorization} = require("../middleware/authorization");


// catRouter.use(authorization);
catRouter.use(authentication);
catRouter.get("/", catController.getCats);
catRouter.get("/:id",  catController.getCatsById);


catRouter.post("/", catController.postCats);
catRouter.put("/:id", catController.putCats);
catRouter.patch("/:id", catController.patchCats);
catRouter.delete("/:id", catController.deleteCats);

module.exports = catRouter;
