// const express = require("express")
const { requireAuth } = require("../midleware/auth");
const express = require("express");
const router = express.Router();

const {
  createList,
  
  
} = require("../controlar/list.js");


router.post('/create-list',requireAuth,createList);
module.exports = router;
