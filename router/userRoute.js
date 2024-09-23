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
    UserBooklist,
    paymentSuccess ,
    paymentFail,
    favoritelist,
    softDeleteUser
} = require("../controlar/user.js");

router.put("/favoriteslist-list/:id",requireSignin,addFavoritelist)
router.put("/unfavoriteslist-list/:id",requireSignin,removeFavoritelist)
router.post('/book-property/:id', requireSignin,bookProperty);

router.get("/check-available/:id",requireSignin,checkAvailability);
// public user 
router.get("/get-single-user/:id",requireSignin,getCurrentUser);
router.get("/user-favoriteslist/:id",requireSignin,favoritelist)
// 
router.get("/user-booking-list",requireSignin,UserBooklist);
router.put("/payment-success",requireSignin,paymentSuccess);
router.put("/fail-payment",requireSignin,paymentFail)
router.put("/delete-user",requireSignin,softDeleteUser)
module.exports = router;
