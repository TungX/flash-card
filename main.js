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
var uri = 'mongodb://heroku_nsrkjq2k:89jau49iammlhef1n7bm8d3iq7@ds261296.mlab.com:61296/heroku_nsrkjq2k';
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
var urlNonAuths = ['/sessions', '/users/add', '/users', '/words'];
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    if (urlNonAuths.indexOf(req.url) > -1) {
        next();
        return;
    }
//    if (!req.session.user || !req.cookies.user_sid) {
//        res.redirect('/sessions');
//        return;
//    }
    next();
});

app.use('/users', require('./routers/user'));
app.use('/sessions', require('./routers/session'));
app.use('/words', require('./routers/word'));
app.use('/api/words', require('./routers/api/word'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/" + "learn.html");
});

//const Word = require('./models/word');
//const newWord = Word.create({
//    content: 'hello',
//    proncs: [{content: '/həˈləʊ/', audio_url: 'https://d27ucmmhxk51xv.cloudfront.net/media/english/ameProns/hello.mp3?version=1.1.86'}],
//    examples: [{content: 'Hello, John! How are you?', content_vi: 'Chao Jon, Ban khoe khong', audio_url: 'https://d27ucmmhxk51xv.cloudfront.net/media/english/exaProns/p008-001354151.mp3?version=1.1.86'}, {content: 'Stanley, come and say hello to your nephew.', content_vi: 'Stanley, đến và nói xin chào với cháu trai của bạn.', audio_url: 'https://d27ucmmhxk51xv.cloudfront.net/media/english/exaProns/p008-001725228.mp3?version=1.1.86'}],
//    relationships: [{content: 'hi', type: 'syn', example: 'Hi, Gwen – did you have a nice weekend?'}, {content: 'hey', type: 'syn', example: 'Hey, Scott! What’s up, buddy?'}],
//    description: [{type: 'text', content: 'used as a greeting when you see or meet someone'}, {type: 'text', content: 'xin chào'}],
//    user_id: '5ce3c179d3886f34f9763ef3'
//});

var server = app.listen(process.env.PORT || 5000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
});
