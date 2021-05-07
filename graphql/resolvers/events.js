const Event = require('../../models/event-model');
const User = require('../../models/user-model');
const { dateToString } = require('../../helpers/date-conversion');

module.exports = {
    events: () => {
        return Event.find().populate('createdBy')
            .then(events => {
                return events.map(event => {
                    return { ...event._doc, date: dateToString(event._doc.date) };
                });
            }).catch(err => {
                throw err;
            });
    },
    createEvent: (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthorized!!!');
        }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            createdBy: req.userId
        });
        let createdEvent;
        return event.save()
            .then(result => {
                createdEvent = { ...result._doc, date: dateToString(result._doc.date) };
                return User.findById(req.userId)
            })
            .then(user => {
                user.createdEvents.push(event);
                return user.save();
            })
            .then(result => {
                return createdEvent;
            })
            .catch(err => {
                throw err;
            });
    }
}