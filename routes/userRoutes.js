const express = require("express");
const userRouter = express.Router();
const{login, signup} = require("./../controllers/userController")

userRouter.post("/login", login);
userRouter.post("/signup", signup)

module.exports = userRouter;