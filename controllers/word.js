/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const Word = require('../models/word');

function getAll(req, res){
    res.sendFile(__dirname + '/views/words/words.html');
}

function insert(req, res){

}

function update(req, res){

}

function remove(req, res){

}

module.exports = {
    getAll,
    insert,
    update,
    remove
};

