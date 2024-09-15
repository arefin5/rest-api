// const express = require("express")
const express = require("express");
const { requireSignin ,canEditDeletePost,isHost} = require("../midleware/auth");
const router = express.Router();
const {
    addFavoritelist,
    removeFavoritelist
} = require("../controlar/user.js");

router.put("/favoriteslist-list/:id",requireSignin,addFavoritelist)
router.put("/unfavoriteslist-list/:id",requireSignin,removeFavoritelist)

module.exports = router;
