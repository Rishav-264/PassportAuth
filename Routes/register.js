const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const {ensureAuthenticated} = require('../config/auth');
const router = express.Router();

const User = require('../models/user');
const Token = require('../models/token');
const passport = require('passport');

router.get('/form',(req,res,next)=>{
    res.render('signup',{
        display:"display:none",
        messsage:""
    });
})

router.post('/form',(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    const rpassword = req.body.rpassword;
    User.find({email:email},(error,docs)=>{
        if(error) console.log(error);
        if(docs.length!=0){
            console.log("User Already exists");
            res.render('signup',{
                display:"display:block",
                message:"User Already Exists"
            });
        }
        else{
            if(password === rpassword){
                bcrypt.genSalt(10,(err,salt)=>{
                    if(err) {console.log(err);}
                    else{
                        bcrypt.hash(password,salt,(err,hash)=>{
                            if(err) console.log(err);
                            const user = new User({
                                email:email,
                                password:hash,
                                isVerified:false
                            });
                            user.save((error)=>{
                                if(error) console.log(error);
                                console.log("User Created");
                            });
                            var token = crypto.randomBytes(16).toString('hex');
                            const newToken = new Token({
                                email:email,
                                token:token
                            })
                            newToken.save((error)=>{
                                if(error) console.log(error);
                                console.log("Token Saved");
                            });
                            var link = req.get('host')+"/verify/"+token;
                            var smtpConfig = {
                                host: 'smtp.gmail.com',
                                port: 465,
                                secure: true,
                                auth: {
                                    user: 'rishavgooptu1234@gmail.com',
                                    pass: 'CHEMICALbond'
                                }
                            };
                            var transporter = nodemailer.createTransport(smtpConfig)
                            var mailOptions = {
                                from:"rishavgooptu1234@gmail.com",
                                to:email,
                                subject:"test verification",
                                text:link
                            };
                            transporter.sendMail(mailOptions,(err)=>{
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    console.log("Email Sent");
                                }
                            })
                            res.render('login',{
                                display:"display:block",
                                message:"Registration Succesfull."
                            });
                        })
                    }
                })
            }
            else{
                console.log("User error");
                res.render('signup',{
                    display:"display:block",
                    message:"Password do not match"
                });
            }
        }
    })    
   
})

module.exports = router;