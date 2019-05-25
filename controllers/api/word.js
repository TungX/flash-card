const Word = require('../../models/word');

async function getAll(req, res) {
    try {
        const userId = 'blue.rose.hut@gmail.com';
        const words = await Word.find({'user_id': userId});
        res.send({
            status: 1,
            words: words
        });
    } catch (e) {
        res.send({
            status: 0,
            message: e.message
        });
    }
}

async function getWordLearn(req, res) {
    try {
        const userId = 'blue.rose.hut@gmail.com';
        const words = await Word.find({'user_id': userId});
        res.send({
            status: 1,
            words: words
        });
    } catch (e) {
        res.send({
            status: 0,
            message: e.message
        });
    }
}

async function show(req, res) {
    try {
        const id = req.param('id');
        const userId = 'blue.rose.hut@gmail.com';
        const word = await Word.findOne({'user_id': userId, '_id': id});
        if (word === null)
            res.send({
                status: 0,
                message: 'cannot find word of users'
            });
        else
            res.send({
                status: 1,
                word: word
            });
    } catch (e) {
        res.send({
            status: 0,
            message: e.message
        });
    }
}

async function insert(req, res) {
    let wordInfo = req.body;
    wordInfo['user_id'] = 'blue.rose.hut@gmail.com';
    try {
        const word = await Word.create(wordInfo);
        res.send({
            status: 1,
            id: word._id
        });
    } catch (e) {
        res.send({
            status: 0,
            message: e.message
        });
    }

}

async function update(req, res) {
    let id = req.param('id');
    let wordInfo = req.body;

    try {
        const word = await Word.updateOne({_id: id}, wordInfo);
        res.send({
            status: 1,
            id: word._id
        });
    } catch (e) {
        res.send({
            status: 0,
            message: e.message
        });
    }
}

async function remove(req, res) {

}

module.exports = {
    getAll,
    show,
    insert,
    update,
    getWordLearn,
    remove
};