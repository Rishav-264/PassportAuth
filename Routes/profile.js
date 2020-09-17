const express = require('express');
const passport = require('passport');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');


router.get('/',ensureAuthenticated,(req,res,next)=>{
    res.render('profile');
})

module.exports = router;