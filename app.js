const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
const { Strategy: AuthsiderStrategy } = require('passport-authsider');

const middlewares = require('./routes/middlewares');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');

dotenv.config();

// Initialize and use the Authsider strategy
passport.use(new AuthsiderStrategy({
    domain: process.env.AUTHSIDER_DOMAIN,
    clientID: process.env.AUTHSIDER_CLIENT_ID,
    clientSecret: process.env.AUTHSIDER_CLIENT_SECRET,
    callbackURL: process.env.AUTHSIDER_CALLBACK_URL || 'http://localhost:3000/login/callback',
}, function (accessToken, refreshToken, extraParams, profile, done) {
    return done(null, profile);
}));

passport.serializeUser(function (user, done) {
    // You can implement your own serialization process
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    // You can implement your own serialization process
    done(null, user);
});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(cookieParser());

app.use(session({
    secret: 'shhhh',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production'
    }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


app.use(middlewares.setViewLocals);
app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/profile', profileRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
