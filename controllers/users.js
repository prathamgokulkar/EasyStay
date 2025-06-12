const User = require('../models/user');

module.exports.renderSignUpForm = (req,res) =>{
    res.render("users/signup.ejs");
}

module.exports.signup =  async(req, res, next) =>{
    try {
        let {username, email, password} = req.body;
        const user = new User({username, email});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Welcome to EasyStay !');
            res.redirect('/listings');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
};

module.exports.renderloginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async(req, res, next) => {
    req.flash('success', 'Welcome back!');
    let redirectUrl = res.locals.redirectUrl || '/listings'
    res.redirect(redirectUrl);
};

module.exports.logOut = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/listings');
    });
};