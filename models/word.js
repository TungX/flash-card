const mongoose = require('mongoose');
const pronunciationSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            trim: true,
            required: true
        },
        audio_url: {
            type: String,
        }
    },
    {
        timestamps: true
    },
);

const relationSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            trim: true,
            required: true
        },
        type: {
            type: Number,
            default: 0
        },
        audio_url: {
            type: String,
        }
    },
    {
        timestamps: true
    },
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
            type: String,
        }
    },
    {
        timestamps: true
    },
);
const wordSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            trim: true,
            index: true,
            unique: true,
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
        description: {
            type: String,
            required: true
        },
        mean_vn: {
            type: String,
            required: true
        },
        user_id: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    },
);


module.exports = mongoose.model('Word', wordSchema);
