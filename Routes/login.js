const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/',(req,res,next)=>{
    res.render('login',{
        display:"display:none",
        message:""
    });
})

router.post('/',
  passport.authenticate('local'),
  function(req,res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    if(req.user.isVerified === false){
        res.render('verification');
    }
    else{
        res.render('profile');
    }
})
    
  

module.exports = router;