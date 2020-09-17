const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user')

module.exports = function(){
passport.use('local',new Strategy(
    {usernameField:"email"},
    (username,password,done)=>{
        User.findOne({email:username},(err,user)=>{
            if(err){ return done(err) }
            if(!user){
                return done(null,false)
            }
            bcrypt.compare(password, user.password, function(err, result) {
                if(!result){
                    return done(null,false)
                }
                else{
                    return done(null,user)
                }
            });
        })
    }
))

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

}
