/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const User = require('../models/user');

function show(req, res) {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/');
        return;
    }
    res.sendFile(__dirname + '/views/sessions/show.html');
}

function login(req, res) {
    var email = req.body.email,
            password = req.body.password;
    console.log(req.body);
    console.log(email);
    User.findOne({email: 'blue.rose.hut@gmail.com'}).then(function (user) {        
        if (!user) {
            console.log('user is '+user);
            res.redirect('/sessions');
        } else if (!user.validPassword(password)) {
            console.log('password is valid ');
            res.redirect('/sessions');
        } else {
            console.log('login success');
            req.session.user = user;
            console.log(req.session.user);
            res.redirect('/');
        }
        
    });
}

function logout(req, res) {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');        
        res.redirect('/');
    }
}

module.exports = {
    show,
    login,
    logout
};