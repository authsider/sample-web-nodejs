/**
 * Middleware function to apply the user loaded by passport into the view locals.
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.setViewLocals = function (req, res, next) {
    res.locals.user = req.user;
    next();
};

/**
 * Middleware function to make sure there is an authenticated user before accessing the next route handler.
 *
 * @param req
 * @param res
 * @param next
 */
module.exports.ensureAuthenticatedUser = function (req, res, next) {
    if (req.user) return next();

    req.session.returnTo = req.originalUrl;
    res.redirect('/login');
};
