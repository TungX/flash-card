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
            }
        },
        {
            timestamps: true
        },
        );
module.exports = mongoose.model('Word', wordSchema);
