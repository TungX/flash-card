const mongoose = require('mongoose');
const pronunciationSchema = new mongoose.Schema(
        {
            content: {
                type: String,
                trim: true,
                required: true
            },
            dialect: {
                type: String,
                trim: true,
                required: true
            },
            audio_url: {
                type: String
            }
        }
);
const answerSchema = new mongoose.Schema({
    content: {
        type: String,
        trim: true,
        required: true
    },
    type: Boolean

});
const questionSchema = new mongoose.Schema({
    content: {
        type: String,
        trim: true,
        required: true
    },
    type: {
        type: String,
        enum: ['fill_blank_by_type',
            'fill_blank_by_choose',
            'select_word_from_desciption',
            'type_word_from_desciption',
            'listen_word',
            'listen_sentence',
            'speak_word',
            'speak_sentence'
        ]
    },
    skill: {
        type: String,
        enum: ['reading', 'writing', 'listening', 'speaking']
    },
    answers: {
        type: [answerSchema],
        default: []
    }
});
const relationSchema = new mongoose.Schema(
        {
            content: {
                type: String,
                trim: true,
                required: true
            },
            type: {
                type: String,
                enum: ['syn', 'opp'],
                default: 'syn'
            },
            example: {
                type: String,
                default: ''
            }
        }
);
const familySchema = new mongoose.Schema(
        {
            content: {
                type: String,
                trim: true,
                required: true
            },
            type: {
                type: String,
                enum: ['n', 'v', 'adj', 'adv'],
                default: 'n'
            },
            example: {
                type: String,
                default: ''
            }
        }
);
const exampleSchema = new mongoose.Schema(
        {
            content: {
                type: String,
                trim: true,
                required: true
            },
            content_vi: {
                type: String,
                trim: true,
                default: ''
            },
            audio_url: {
                type: String
            }
        }
);
const descriptionSchema = new mongoose.Schema(
        {
            content: {
                type: String,
                trim: true,
                required: true
            },
            type: {
                type: String, //0: Text, 1: image
                enum: ['text', 'image'],
                default: 'text'
            }
        }
);
const wordSchema = new mongoose.Schema(
        {
            content: {
                type: 'String',
                trim: true,
                index: true,
//                unique: true,
                required: true
            },
            proncs: {
                type: [pronunciationSchema],
                default: []
            },
            examples: {
                type: [exampleSchema],
                default: []
            },
            relationships: {
                type: [relationSchema],
                default: []
            },
            descriptions: {
                type: [descriptionSchema],
                required: true
            },
            user_id: {
                type: String,
                required: true
            },
            type: {
                type: String,
                enum: ['n', 'v', 'adj', 'adv'],
                default: 'n'
            },
            word_families: {
                type: [familySchema],
                default: []
            },
            questions: {
                type: [questionSchema],
                default: []
            }

        },
        {
            timestamps: true
        },
        );
module.exports = mongoose.model('Word', wordSchema);
