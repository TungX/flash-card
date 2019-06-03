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
        const page = 0;
        const wordPerPage = 5;
        const userId = 'blue.rose.hut@gmail.com';
        const words = await Word.find({'user_id': userId}, {},
                {limit: wordPerPage, skip: wordPerPage * page, sort: {scope: 1}});
        const wordToLearns = [];
        const practices = [];
        for (let i = 0; i < words.length; i++) {
            const word = words[i].toJSON();
            const skills = {};
            skills['reading'] = [];
            skills['writing'] = [];
            skills['listening'] = [];
            skills['speaking'] = [];
            for (let j = 0; j < word.questions.length; j++) {
                const question = word.questions[j];
                question['word_id'] = word._id;
                question['_id'] = undefined;
                skills[question.skill].push(question);
            }
            let sum = 0;
            const rate = [];
            Object.keys(word.skills).forEach(function (key) {
                sum += word.skills[key];
                rate.push(key);
            });
            rate[0] = rate[0] / sum;
            for (let k = 1; k < rate.length; k++) {
                rate[k] = rate[k - 1] + rate[k] / sum;
            }
            
            for(let w = 0; w < 4; w++){
                
            }

            words[i]['number_study_times'] = words[i]['number_study_times'] + 1;
            words[i]['scope'] = words[i]['number_success_times'] / words[i]['number_study_times'];
            words[i].save();
            word.questions = undefined;
            word['user_id'] = undefined;
            word['scope'] = undefined;
            word['createdAt'] = undefined;
            word['updatedAt'] = undefined;
            word['__v'] = undefined;
            word['skills'] = undefined;
            word['number_study_times'] = undefined;
            word['number_success_times'] = undefined;
            wordToLearns.push(word);
        }

        res.send({
            status: 1,
            practices: practices,
            words: wordToLearns
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