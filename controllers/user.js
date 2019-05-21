/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


const User = require('../models/user');

async function add(req, res) {
    res.sendFile(__dirname + '/views/users/add.html');
}

async function insert(req, res) {
    console.log('Insert user');
    console.log(req.body);
    User.create({
        email: req.body.email,
        password: req.body.password
    })
            .then(user => {
                req.session.user = user.dataValues;
                res.redirect('/');
            })
            .catch(error => {
                console.log(error);
                res.redirect('/users/add');
            });
}
module.exports = {
    add,
    insert
};