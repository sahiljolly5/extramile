const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({

    company: {
        type: String,
        required: true,
        trim: true
    },
    model: {
        type: String,
        required: true,
        trim: true
    },
    engineType: {
        type: String,
        required: true,
        trim: true
    },
    jobs: {
        type: Array,
        required:true,
        trim: true
    }}
);

module.exports = mongoose.model("Service", serviceSchema);