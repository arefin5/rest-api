// const express = require("express")
const { requireAuth } = require("../midleware/auth");
const express = require("express");
const router = express.Router();

const {
  createList,
  lists
  
} = require("../controlar/list.js");


router.post('/create-list',requireAuth,createList);
router.get('/all-list',requireAuth,lists);

module.exports = router;
