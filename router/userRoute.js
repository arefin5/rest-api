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
    bookingApproved,
    allBookingListForHost,
    bookingPaymentClaim,
    bookPropertyPayment,
    rejectApprovedPending,
    rejectApproved,
    bookingComplete,
    bookingUpcoming
} = require("../controlar/user.js");

router.put("/favoriteslist-list/:id",requireSignin,addFavoritelist)
router.put("/unfavoriteslist-list/:id",requireSignin,removeFavoritelist)
router.post('/book-property/:id',requireSignin, bookProperty);
router.post ("/payment-property/:id",requireSignin,bookPropertyPayment )
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
router.put("/claim-booking-payment/:id",requireSignin,bookingPaymentClaim)
router.post("/reject-booking/:id",requireSignin,rejectApproved)

router.get("/host-pending-booking-list",requireSignin,bookingApprovedPending);
router.get("/host-all-booking-list",requireSignin,allBookingListForHost)
router.get("/host-reject-booking-list",requireSignin,rejectApprovedPending);
router.get("/host-booking-upcoming",requireSignin,bookingUpcoming)
router.get("/host-booking-complete",requireSignin,bookingComplete)
module.exports = router;
