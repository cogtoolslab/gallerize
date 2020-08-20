const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const responseSchema = new Schema({
    session_id: {
        type: String,
        required: true
    },
    age: {
        type: String,
        require: true
    },
    class: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    worker_id:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

const Response = mongoose.model('Response', responseSchema, 'invalid_draw_test')

module.exports = Response;