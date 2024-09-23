// const express = require("express")
const express = require("express");
const { requireSignin ,canEditDeletePost,isHost} = require("../midleware/auth");
const {checkAdmin} =require("../midleware/admin")

const router = express.Router();
const {
    getFailedBookings,
    getAllBooking,
    getAllPanding,
    aprovedBooking,
    aprovedList,
    aprovedAdmin,
    getAlluser,
    getAllList,
    blockuser,
    aprovedListPublished
} = require("../controlar/admin.js");
router.get('/failed-booking-all',requireSignin,checkAdmin,getFailedBookings);
router.get('/all-booking',requireSignin,checkAdmin,getAllBooking);
router.get("/get-single-list/:id",requireSignin,checkAdmin,getAllPanding);
router.put("/published-list/:id",requireSignin,checkAdmin,aprovedList);
router.put("/booking-confirm/:id",requireSignin,checkAdmin,aprovedBooking);
router.put("/create-admin/:id",requireSignin,checkAdmin,aprovedAdmin)
router.put("/published-from-host",canEditDeletePost,aprovedListPublished)
router.get("/all-user",requireSignin,checkAdmin,getAlluser);
router.get("/all-list",requireSignin,checkAdmin,getAllList);

router.put("/block-user/:id",requireSignin,checkAdmin,blockuser);


module.exports = router;
