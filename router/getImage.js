// const express = require("express")
const { requireAuth } = require("../midleware/auth");
const express = require("express");
const router = express.Router();

const {
  GetImage,
  getVerificationImage
  
} = require("../controlar/imageControlar");


router.get('/privet-image/:public_id',requireAuth,GetImage);
router.get("/get-image",requireAuth,getVerificationImage)
module.exports = router;
