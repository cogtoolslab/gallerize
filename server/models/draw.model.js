const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const drawSchema = new Schema({
    filename: {
        type: String,
        required: true,
        unique: true
    },
    session_id: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        require: true
    },
    valid: {
        type: Number,
    },
    class: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    games: {
        type: Array,
        required: true
    }
}, {
    timestamps: true,
});

const Draw = mongoose.model('Draw', drawSchema, 'check_invalid_cdm_run_v7_production');

module.exports = Draw;