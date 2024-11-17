const user = require('../models/user');

module.exports.getsignup = (req, res) => {
    res.render('./user/signup.ejs');
};

module.exports.postSignup = async(req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new user({email, username});
        const registerdUser = await user.register(newUser,password);
        req.login(registerdUser, (err) => {
            if(err) {
                return next();
            }
            req.flash("sucess","Welcome to WonderLust");
            res.redirect('/listings');
        });
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    
};

module.exports.loginPage = (req, res) => {
    res.render('./user/login.ejs');
};

module.exports.login = async(req, res) => {
    req.flash("sucess", "Welcome back to WonderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("sucess", "Logout Sucessfully!");
        res.redirect('/listings');
    });
};
