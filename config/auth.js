module.exports = {
    ensureAuthenticated: function(req,res,next) {
        if(req.isAuthenticated()){
            return next();
        }
        res.render('login',{
            AuthError:"Please Log In.",
            Success:"",
            Display:"display:block",
            Display1:"display:none"
        });
    }
}