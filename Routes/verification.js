const express = require('express');
const router = express.Router();
const Token = require('../models/token');
const User = require('../models/user');

router.get('/:token',(req,res)=>{
    const token = req.params.token;
    console.log(token);
    Token.findOne({token:token},(error,user)=>{
        if(error) console.log(error);
        const email = user.email;
        console.log(user);
        User.findOne({email:email},(error,user)=>{
            if(error){
                console.log(error);
            }
            if(!user){
                res.send("No User Found");
            }
            else{
               user.isVerified = true;
               user.save();
            }
        })
    })
    res.send("<h1>Congrats</h1>")
})

module.exports = router;