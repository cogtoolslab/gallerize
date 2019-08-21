const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const drawSchema = new Schema({
    filename:{
        type: String,
        require:true
    },
    gameID: {
        type: String,
        required: true
    },
    trialNum: {
        type: Number,
        required: true
    },
    repetition: {
        type: Number,
        require: true
    },
    valid: {
        type: Number,
        require: true
    },
    both:{
        type: String
    },
    demo96:{
        type: String
    },
    class: {
        type: String,
        required: true
    },
    url:{
        type: String,
        required:true
    }
}, {
        timestamps: true,
    });

const Draw = mongoose.model('CollabDraw', drawSchema,'collabdraw-96');

module.exports = Draw;