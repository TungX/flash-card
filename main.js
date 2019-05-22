/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');

var options = {
    autoIndex: false,
    useNewUrlParser: true
};
var uri = 'mongodb://127.0.0.1/flashcard';
mongoose.connect(uri, options, )
        .then(() => {
            console.log(`Connected database successfully: ${uri}`);
        }, err => {
            console.log(`Error while connecting to database\n${err}`);
        });

//var morgan = require('morgan');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '100mb'}));

app.use(cookieParser());


app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));
var urlNonAuths = ['/sessions', '/users/add', '/users','/words'];
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    if (urlNonAuths.indexOf(req.url) > -1) {
        next();
        return;
    }
    if (!req.session.user || !req.cookies.user_sid) {
        res.redirect('/sessions');
    }
    next();
});

//var sessionChecker = (req, res, next) => {
//    if (req.session.user && req.cookies.user_sid) {
//        res.redirect('/');
//    } else {
//        next();
//    }
//};
//
//// route for user Login
//app.route('/login')
//        .get(sessionChecker, (req, res) => {
//            res.sendFile(__dirname + '/public/login.html');
//        })
//        .post((req, res) => {
//            
//        });
//
//app.get('/logout', (req, res) => {
//    if (req.session.user && req.cookies.user_sid) {
//        res.clearCookie('user_sid');
//        res.redirect('/');
//    }
//});

//
//function checkAuth(req, res, next) {
//    console.log('checkAuth ' + req.url);
//
//    // don't serve /secure to those not logged in
//    // you should add to this list, for each and every secure url
//    if (req.url === '/secure' && (!req.session || !req.session.authenticated)) {
//        res.render('unauthorised', {status: 403});
//        return;
//    }
//
//    next();
//}
//app.use(express.cookieParser());
//app.use(express.session({secret: 'flash-card-by-maihoang'}));
//app.use(express.bodyParser());
//app.all("*", checkAuth());
app.use('/users', require('./routers/user'));
app.use('/sessions', require('./routers/session'));
app.use('/words', require('./routers/word'));
app.use('/api/words', require('./routers/api/word'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/" + "learn.html");
});
//app.get('/practice', function (req, res) {
//    res.sendFile(__dirname + "/public/" + "practice.html");
//});

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
});
