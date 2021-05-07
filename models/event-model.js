const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
});

const event = mongoose.model('event', eventSchema);
module.exports = event;
