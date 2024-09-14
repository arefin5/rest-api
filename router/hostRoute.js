// const express = require("express")
const express = require("express");
const router = express.Router();
const { requireAuth,requireSignin ,canEditDeletePost} = require("../midleware/auth");

const {
  createList,
  lists,
  updateList,
  deleteSinglelist,
  getSingleList
  
} = require("../controlar/list.js");


router.post('/create-list',requireSignin,createList);
router.get('/all-list',requireSignin,lists);
router.get("/get-single-list/:id",requireSignin,getSingleList)
router.put("/update-list/:id",requireSignin,canEditDeletePost,updateList)
router.delete("/delete-list/:id",requireSignin,canEditDeletePost,deleteSinglelist)
module.exports = router;
