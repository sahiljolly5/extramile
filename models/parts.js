const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const partSchema = new Schema({

    parts: {
        type: Array,
    }}
    );

module.exports = mongoose.model("Part", partSchema);