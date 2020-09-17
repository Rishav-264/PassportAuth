const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const Strategy = require('./config/strategy');
const User = require('./models/user')
const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }))

app.use(passport.initialize());
app.use(passport.session());

require('./config/strategy')();

const registerRoute = require('./Routes/register');
const loginRoute = require('./Routes/login');
const profileRoute = require('./Routes/profile');
const verifyRoute = require('./Routes/verification');

mongoose.connect("mongodb+srv://Rishav:4Bs9IDfya2rUScux@cluster0.192oi.mongodb.net/UsersAuth1?retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology:true},(error)=>{
    if(error) console.log(error);
    console.log(('Database Connected'));
});

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


app.use(express.static('public'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use('/login',loginRoute);
app.use('/register',registerRoute);
app.use('/profile',profileRoute);
app.use('/verify',verifyRoute);

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log("Server Running");
})