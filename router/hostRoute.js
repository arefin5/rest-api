// const express = require("express")
const express = require("express");
const { requireSignin ,canEditDeletePost,isHost} = require("../midleware/auth");
const router = express.Router();
const {
  createList,
  lists,
  updateList,
  deleteSinglelist,
  allListByUser,
  HostCheck,
  getSingleList
} = require("../controlar/list.js");
router.post('/create-list',requireSignin,isHost,createList);
// router.get('/all-list',requireSignin,lists);

router.get('/all-list',lists);
router.get("/get-single-list/:id",getSingleList)
router.put("/update-list/:id",requireSignin,canEditDeletePost,updateList)
router.delete("/delete-list/:id",requireSignin,canEditDeletePost,deleteSinglelist);
router.get("/all-draft",canEditDeletePost,allListByUser);

router.get("/host-check",requireSignin,isHost,HostCheck)
module.exports = router;
