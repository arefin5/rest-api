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
    aprovedListPublished,
    allBookingList,
    getRateOfService,
    createVat,
    updateVat,
    getAllhost,
    allBookingPayment,
    allBookingPaymentHost
} = require("../controlar/admin.js");
router.get('/admin/failed-booking-all',requireSignin,checkAdmin,getFailedBookings);
router.get('/admin/all-booking',requireSignin,checkAdmin,getAllBooking);
router.put("/admin/published-list/:id",requireSignin,checkAdmin,aprovedList);
router.put("/admin/booking-confirm/:id",requireSignin,checkAdmin,aprovedBooking);
router.get("/admin/book-list",allBookingPayment);
router.get("/payment-book-list",requireSignin,allBookingPaymentHost)
// /host/book-list
router.put("/admin/create-admin/:id",requireSignin,checkAdmin,aprovedAdmin)
router.get("/admin/all-user",requireSignin,checkAdmin,getAlluser);
router.get("/admin/all-host",requireSignin,checkAdmin,getAllhost)
router.get("/admin/all-list",requireSignin,checkAdmin,getAllList);

router.get("/admin/get-pending/",requireSignin,checkAdmin,getAllPanding);

router.put("/block-user/:id",requireSignin,checkAdmin,blockuser);
router.put("/admin/published-from-host/:id",canEditDeletePost,aprovedListPublished)
router.get("/all-booking",requireSignin,checkAdmin,allBookingList);

router.get("/service-rate",getRateOfService)
router.post('/service-and-vat', createVat)
router.put("/admin/update-vat",updateVat)
module.exports = router;
