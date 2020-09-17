module.exports = {
    ensureAuthenticated: function(req,res,next) {
        if(req.isAuthenticated()){
            return next();
        }
        res.render('login',{
            display:'display:block',
            message:'Please Log In.'
        });
    }
}