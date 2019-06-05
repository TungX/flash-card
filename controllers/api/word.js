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

function addPractice(practices, questions, number) {
    if (number < 0) {
        return;
    }
    const length = questions.length <= number ? questions.length : number;
    for (let i = 0; i < length; i++) {
        const question = questions.splice(Math.round(Math.random() * (questions.length - 1)), 1)[0];
        if (practices.length === 0) {
            practices.push(question);
        } else {
            const index = Math.round(Math.random() * (practices.length - 1));
            practices.splice(index, 0, question);
        }
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
            const practiceOfWord = [];
            const numberOfQuestion = words[i]['number_study_times'] + 1;
            Object.keys(skills).forEach(function (skill) {
                addPractice(practiceOfWord, skills[skill], numberOfQuestion - word.skills[skill]);
            });

            const numberPractices = practiceOfWord.length < 4 ? practiceOfWord.length : 4;
            for (let j = 0; j < numberPractices; j++) {
                const question = practiceOfWord.splice(Math.round(Math.random() * (practiceOfWord.length - 1)), 1)[0];
                if (practices.length === 0) {
                    practices.push(question);
                } else {
                    const index = Math.round(Math.random() * (practices.length - 1));
                    practices.splice(index, 0, question);
                }
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