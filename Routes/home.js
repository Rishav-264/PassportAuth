const express = require('express');
const passport = require('passport');
const router = express.Router();


router.get('/',(req,res,next)=>{
    res.render('home');
})

module.exports = router;