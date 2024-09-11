const { model } = require("mongoose");
const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    return res.render("users/signup.ejs"); // Return added here
}; 

module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err); // Return added here
            }
            req.flash("success", "Welcome to TravelBNB");
            return res.redirect("/listings"); // Return added here
        });
    } catch (e) {
        console.log(e.message);
        req.flash("error", e.message);
        return res.redirect("/signup"); // Return added here
    }
};

module.exports.renderLoginForm = (req, res) => {
    return res.render("users/login.ejs"); // Return added here
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to TravelBNB");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    return res.redirect(redirectUrl); // Return added here
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err); // Return added here
        }
        req.flash("success", "You are logged out");
        return res.redirect("/listings"); // Return added here
    });
};
