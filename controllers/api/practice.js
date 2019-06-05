const Word = require('../../models/word');

async function update(req, res) {
    let wordId = req.param('id');
    try {
        console.log(wordId);
        console.log(req.body);
        const word = await Word.findOne({_id: wordId});
        if (word === null)
            res.send({
                status: 0,
                message: 'cannot find word of users'
            });
        else
        {
            word['skills'][req.body['skill']] += 1;
            word['number_success_times'] += 1;
            if (word['number_study_times'] === 0) {
                word['number_study_times'] = 1;
            }
            word['scope'] = word['number_success_times'] * 1.0 / word['number_study_times'];

            await word.save();
            res.send({
                status: 1
            });

//        var query = {_id: wordId},
//                update = {skills[req.body['skill']]: word.skills[req.body['skill']] + 1,
//                    number_success_times: word.number_success_times + 1,
//                    scope: word.scope},
//                options = {upsert: true, new : true, setDefaultsOnInsert: true};
//        await Word.findOneAndUpdate(query, update, options);

        }
    } catch (e) {
        console.log(e);
        res.send({
            status: 0,
            message: e
        });
    }

}

async function buildQuestions(req, res) {
    try {
        await createQuestions();
        res.send({
            status: 1,
            message: 'Build question complete'
        });
    } catch (e) {
        res.send({
            status: 0,
            message: e.message
        });
    }

}

async function createQuestions() {
    const words = await Word.find();
    const pattern = /<strong>(.*)<\/strong>/i;
    const indexs = [];
    if (words.length < 4) {
        throw new Error('length of word is ' + words.length + ', that less than 4');
    }
    for (var j = 0; j < words.length; j++) {
        indexs.push(j);
    }
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        word.questions = [];
        //fill_blank_by_type
        const questionFillBlankByType = {type: 'fill_blank_by_type'};
        let index = Math.round(Math.random() * (word.examples.length - 1));
        let example = word.examples[index].content;
        let result = example.match(pattern);
        if (!!result) {
            questionFillBlankByType.content = example.replace(result[0], "___");
            questionFillBlankByType.answers = [{content: result[1], type: true}];
            questionFillBlankByType.skill = 'writing';
            word.questions.push(questionFillBlankByType);
        }

        let tindexs = indexs.slice(0);
        tindexs.splice(i, 1);
        const questionFillBlankByChoose = {type: 'fill_blank_by_choose'};
        index = Math.round(Math.random() * (word.examples.length - 1));
        example = word.examples[index].content;
        result = example.match(pattern);
        if (!!result) {
            questionFillBlankByChoose.content = example.replace(result[0], "___");
            questionFillBlankByChoose.answers = [{content: '(' + word.type + ') ' + word.content, type: true}];
            for (let j = 0; j < 3; j++) {
                index = Math.round(Math.random() * (tindexs.length - 1));
                index = tindexs.splice(index, 1)[0];
                questionFillBlankByChoose.answers.push({content: '(' + words[index].type + ') ' + words[index].content, type: false});
            }
            questionFillBlankByChoose.skill = 'reading';
            word.questions.push(questionFillBlankByChoose);
        }

        tindexs = indexs.slice(0);
        tindexs.splice(i, 1);
        const questionSelectWordFromDesciption = {type: 'select_word_from_desciption'};
        index = Math.round(Math.random() * (word.descriptions.length - 1));
        let description = word.descriptions[index].content;
        questionSelectWordFromDesciption.content = description;
        questionSelectWordFromDesciption.answers = [{content: '(' + word.type + ') ' + word.content, type: true}];
        for (let j = 0; j < 3; j++) {
            index = Math.round(Math.random() * (tindexs.length - 1));
            index = tindexs.splice(index, 1)[0];
            questionSelectWordFromDesciption.answers.push({content: '(' + words[index].type + ') ' + words[index].content, type: false});
        }
        questionSelectWordFromDesciption.skill = 'reading';
        word.questions.push(questionSelectWordFromDesciption);

        const questionTypeWordFromDesciption = {type: 'type_word_from_desciption'};
        index = Math.round(Math.random() * (word.descriptions.length - 1));
        description = word.descriptions[index].content;
        questionTypeWordFromDesciption.content = description;
        questionTypeWordFromDesciption.answers = [{content: word.content, type: true}];
        questionTypeWordFromDesciption.skill = 'writing';
        word.questions.push(questionTypeWordFromDesciption);

        const questionListenWord = {type: 'listen_word'};
        index = Math.round(Math.random() * (word.proncs.length - 1));
        questionListenWord.content = word.proncs[index].audio_url;
        questionListenWord.answers = [{content: word.content, type: true}];
        questionListenWord.skill = 'listening';
        word.questions.push(questionListenWord);

        const questionListenSentence = {type: 'listen_sentence'};
        index = Math.round(Math.random() * (word.examples.length - 1));
        example = word.examples[index].content;
        result = example.match(pattern);
        if (!!result) {
            example = example.replace(result[0], result[1]);
        }
        questionListenSentence.content = word.examples[index].audio_url;
        questionListenSentence.answers = [{content: example, type: true}];
        questionListenSentence.skill = 'listening';
        word.questions.push(questionListenSentence);

        const questionSpeakWord = {type: 'speak_word'};
        index = Math.round(Math.random() * (word.proncs.length - 1));
        questionSpeakWord.content = word.proncs[index].audio_url;
        questionSpeakWord.answers = [{content: word.content, type: true}];
        questionSpeakWord.skill = 'speaking';
        word.questions.push(questionSpeakWord);

        const questionSpeakSentence = {type: 'speak_sentence'};
        index = Math.round(Math.random() * (word.examples.length - 1));
        questionSpeakSentence.content = word.examples[index].audio_url;
        questionSpeakSentence.answers = [{content: word.examples[index].content, type: true}];
        questionSpeakSentence.skill = 'speaking';
        word.questions.push(questionSpeakSentence);
        word.save();
//        try {
//            const wordUpdated = await Word.updateOne({_id: word._id}, word);
//            console.log(wordUpdated);
//        } catch (e) {
//            console.log(e);
//        }
    }
}

module.exports = {
    update,
    buildQuestions
};