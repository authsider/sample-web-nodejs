const express = require('express');
const middlewares = require('./middlewares');

const router = express.Router();

router.get('/', middlewares.ensureAuthenticatedUser, function (req, res) {
    const { _raw, _json, ...user } = req.user;

    const avatar = user.picture || (user.photos && user.photos.length && user.photos[0].value);
    const profile = JSON.stringify(user, null, 2);

    res.render('profile', {
        title: 'Profile',
        avatar,
        profile,
        _json: _json && JSON.stringify(_json, null, 2),
    });
});

module.exports = router;
