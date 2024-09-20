// const express = require("express")
const express = require("express");
const { requireSignin ,canEditDeletePost,isHost} = require("../midleware/auth");
const router = express.Router();
const {
    addFavoritelist,
    removeFavoritelist,
    bookProperty,
    checkAvailability,
    getCurrentUser,
    bookPropertyForTest,
    UserBooklist
} = require("../controlar/user.js");

router.put("/favoriteslist-list/:id",requireSignin,addFavoritelist)
router.put("/unfavoriteslist-list/:id",requireSignin,removeFavoritelist)
router.post('/book/:id', requireSignin,bookProperty);
router.post('/book-test/:id',bookPropertyForTest);

router.get("/check-available/:id",requireSignin,checkAvailability);
router.get("/get-single-user/:id",requireSignin,getCurrentUser);
router.get("/user-booking-list",requireSignin,UserBooklist)
module.exports = router;
