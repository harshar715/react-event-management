const Event = require('../../models/event-model');
const Booking = require('../../models/bookings-model')
const { dateToString } = require('../../helpers/date-conversion');

module.exports = {
    bookings: (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthorized!!!');
        }
        return Booking.find({ user: req.userId })
            .populate('user')
            .populate({
                path: 'event', model: 'event',
                populate: { path: 'createdBy', model: 'user' }
            })
            .then(bookings => {
                return bookings.map(booking => {
                    return {
                        ...booking._doc,
                        createdAt: dateToString(booking._doc.createdAt),
                        updatedAt: dateToString(booking._doc.updatedAt)
                    };
                });
            }).catch(err => {
                throw err;
            });
    },
    bookEvent: (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthorized!!!');
        }
        return Event.findOne({ _id: args.eventId })
            .then(fetchedEvent => {
                const booking = new Booking({
                    user: req.userId,
                    event: fetchedEvent
                });
                return booking.save();
            })
            .then(result => {
                return Booking.findOne({ _id: result._id })
                    .populate('user')
                    .populate({
                        path: 'event', model: 'event',
                        populate: { path: 'createdBy', model: 'user' }
                    })
            })
            .then(booking => {
                return { ...booking._doc }
            })
            .catch(err => {
                throw err;
            });
    },
    cancelBooking: (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthorized!!!');
        }
        let bookingReturn;
        return Booking.findById(args.bookingId).populate('user')
            .populate({
                path: 'event', model: 'event',
                populate: { path: 'createdBy', model: 'user' }
            })
            .then(booking => {
                bookingReturn = booking;
                return Booking.deleteOne({ _id: args.bookingId })
            })
            .then(booking => {
                return bookingReturn
            })
    }
}