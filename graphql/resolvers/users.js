const User = require('../../models/user-model');
const jwt = require('jsonwebtoken');
const { dateToString } = require('../../helpers/date-conversion');
const bcrypt = require('bcryptjs');

module.exports = {
    users: (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthorized!!!');
        }
        return User.find().populate('createdEvents')
            .then(users => {
                return users.map(user => {
                    return {
                        ...user._doc, createdEvents: user._doc.createdEvents.map(event => {
                            return { ...event._doc, date: dateToString(event._doc.date) }
                        })
                    }
                });
            }).catch(err => {
                throw err;
            });
    },
    createUser: (args) => {
        return User.findOne({ email: args.userInput.email }).then(user => {
            if (user) {
                throw new Error('User Exists Already')
            }
            return bcrypt.hash(args.userInput.password, 12)
        })
            .then(hashedPass => {
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPass
                });
                return user.save()

            })
            .then(result => {
                return { ...result._doc, password: null };
            })
            .catch(err => {
                throw err;
            });
    },
    login: ({ email, password }) => {
        let userFound;
        return User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    throw new Error('User does not Exist');
                }
                userFound = user;
                return bcrypt.compare(password, user.password)
            })
            .then(isEqual => {
                if (!isEqual) {
                    throw new Error('Password does not match');
                }
                return jwt.sign({ userId: userFound._id, email: userFound.email }, 'somesecretkey', { expiresIn: '1h' });
            })
            .then(token => {
                return {userId: userFound._id, token: token, tokenExpiration: 1}
            })
    }
}