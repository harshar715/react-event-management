const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingsSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: 'event'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true });

const bookings = mongoose.model('bookings', bookingsSchema);
module.exports = bookings;
