const express = require('express');
const passport = require("passport");
const router = express.Router();

router.get('/login', passport.authenticate('authsider', {
    scope: 'openid email profile'
}), function (req, res) {
    res.redirect('/');
});

router.get('/login/callback', function (req, res, next) {
    passport.authenticate('authsider', function (err, user, info) {
        if (err) return next(err);
        if (!user) return res.redirect('/login');

        req.logIn(user, function (err) {
            if (err) return next(err);

            const returnTo = req.session.returnTo;
            delete req.session.returnTo;
            res.redirect(returnTo || '/profile');
        });
    })(req, res, next);
});

router.get('/logout', function (req, res, next) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
