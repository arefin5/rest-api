// const express = require("express")
const { requireAuth } = require("../midleware/auth");
const express = require("express");
const router = express.Router();

const {
  uploadImagesMultiple,
  uploadImage
} = require("../controlar/imageControlar");


router.post(
  "/upload-image-file",
  requireAuth,
  uploadImagesMultiple
);
router.post("/single-image-upload",
  requireAuth,
  uploadImage)


module.exports = router;
