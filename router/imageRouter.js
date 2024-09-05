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
  UplodadSinglePrivete
} = require("../controlar/imageControlar");


router.post(
  "/upload-image-file",
  requireAuth,
  uploadImagesMultiple
);
router.post("/single-image-upload",
  requireAuth,
  uploadImage)
// 


const SSLCommerz = require('sslcommerz-nodejs');
let settings = {
  isSandboxMode: true, //false if live version
         store_id:'testbox',
         store_passwd: 'qwerty',
     };
 let sslcommerz = new SSLCommerz(settings);
 let valId = '1709162025351ElIuHtUtFReBwE';
 await sslcommerz.validate_transaction_order(valId).then(response => {
     return response;
 }).catch(error => {
     console.log(error);
 })
 
router.post('/upload-privet',UplodadSinglePrivete)
module.exports = router;
