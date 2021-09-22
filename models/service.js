const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user')

const serviceSchema = new Schema({

    UserId :{
        type:Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    userName:{
        type:String,
        required:true,
        trim: true
    },
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