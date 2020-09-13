const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const saltRounds=10;
const { ensureAuthenticated } = require('./config/auth');

const app = express();

app.set('view engine',"ejs");

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }))

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect('mongodb+srv://Rishav:spNKHfxqUunHlunx@cluster0.192oi.mongodb.net/Users1?retryWrites=true&w=majority',{useNewUrlParser:true,useUnifiedTopology:true});
const db = mongoose.connection;
db.on('error',(error)=>{
    console.log(error);
})
db.once('open',()=>{
    console.log("DB connected");
})

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    isVerified:Boolean
})

const User = mongoose.model('User',userSchema)

const Strategy = require('passport-local').Strategy;

passport.use(new Strategy(
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


app.get('/', function (req, res) {
  res.render('login',{
      AuthError:"",
      Success:"",
      Display:"display:none",
      Display1:"display:none"
  });
})

app.get("/register",(req,res)=>{
    res.render("signup",{
        PasswordError:"",
        Display:"display:none"
    });
})

app.get("/profile",ensureAuthenticated,(req,res)=>{
    res.render('profile')
})

app.get('/Info',ensureAuthenticated,(req,res)=>{
    res.render('info')
})

app.post("/register",(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    const rpassword = req.body.rpassword;
    if(password.length<9){
        res.render('signup',{
            PasswordError:"Password must be 8 characters long.",
            Display:"display:block"
        })
    }
    else if(rpassword!=password){
        res.render('signup',{
            PasswordError:"Passwords do not match.",
            Display:"display:block"
        })
    }
    else{
        bcrypt.genSalt(saltRounds,(err,salt)=>{
            bcrypt.hash(password,salt,(err,hash)=>{
                const newUser = new User({
                    email:email,
                    password:hash,
                    isVerified:false
                })
                newUser.save();
                res.render('login',{
                    AuthError:"",
                    Success:"You are now registered.",
                    Display:"display:none",
                    Display1:"display:block"
                })
            })
        })
    }

})

app.post("/",passport.authenticate('local',{
    successRedirect:"/profile",
    failureRedirect:'/'
}))

app.post('/logout',(req,res)=>{
    req.logout();
    res.redirect('/');
})

app.listen(process.env.PORT || 3000,(req,res)=>{
    console.log("Server Running...");
})
