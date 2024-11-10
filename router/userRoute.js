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
    softDeleteUser,
    createReview,
    PropertyBooklist,
    handleBooking,
    confirmPayment,
    confirmSuccess,
    bookingApprovedPending,
    bookingApproved

} = require("../controlar/user.js");

router.put("/favoriteslist-list/:id",requireSignin,addFavoritelist)
router.put("/unfavoriteslist-list/:id",requireSignin,removeFavoritelist)
router.post('/book-property/:id',requireSignin, bookProperty);

router.get("/check-available/:id",checkAvailability);
// public user 
router.get("/get-single-user/:id",requireSignin,getCurrentUser);
router.get("/user-favorite-list",requireSignin,favoritelist)
// 
router.get("/user-booking-list",requireSignin,UserBooklist);
router.get("/property-book-list/:id",PropertyBooklist)
router.put("/payment-success",requireSignin,paymentSuccess);
router.put("/fail-payment",requireSignin,paymentFail)
router.put("/delete-user",requireSignin,softDeleteUser);
router.post("/create-review/:id",requireSignin,createReview);
router.post("/payment/confirm",confirmPayment);
// router.post("/success-payment:/id",confirmSuccess);
router.get("/success-payment/:id", confirmSuccess);
router.post("/success-payment/:id", confirmSuccess);
router.put("/approved-booking/:id",requireSignin,bookingApproved)

router.get("/host-pending-booking-list",requireSignin,bookingApprovedPending)
module.exports = router;
