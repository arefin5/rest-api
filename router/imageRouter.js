// const express = require("express")
const { requireAuth } = require("../midleware/auth");
const express = require("express");
const router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const {
  uploadImagesMultiple,
  uploadImage,
  UplodadSinglePrivete,
  GetImage,
  uploadVerifyImages
} = require("../controlar/imageControlar");


router.post(
  "/upload-image-file",

  uploadImagesMultiple
);
// router.post("/single-image-upload",
//   requireAuth,
//   uploadImage)


router.post("/single-image-upload",
  
  uploadImage)
// 
// router.post('/upload-privet',requireAuth,UplodadSinglePrivete);
router.post('/upload-verify',requireAuth,uploadVerifyImages)
// router.get('/privet-image/:public_id',GetImage);

module.exports = router;
