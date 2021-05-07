import React, { Component } from 'react';
import AuthContext from '../context/auth-context';
import Spinner from '../layouts/Spinner/Spinner';
import BookingList from '../layouts/Bookings/BookingList/BookingList';

import './Bookings.css';

const config = require('../assets/config.json');

class BookingsPage extends Component {

    state = {
        isLoading: false,
        bookings: []
    };

    static contextType = AuthContext;

    componentDidMount() {
        this.fetchBookings()
    }

    fetchBookings() {
        this.setState({ isLoading: true });
        const requestBody = {
            query: `
                query {
                    bookings {
                        _id
                        createdAt
                        event {
                            _id
                            title
                            date
                        }
                    }
                }
            `
        }


        fetch(config.URL, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed !!');
                }
                return res.json();
            })
            .then(data => {
                const bookings = data.data.bookings;
                this.setState({ bookings: bookings, isLoading: false });

            })
            .catch(err => {
                this.setState({ isLoading: false });
                console.log(err);
            })

    }

    deleteBookingHandler = bookingId => {

        const requestBody = {
            query: `
                mutation {
                    cancelBooking(bookingId: "${bookingId}") {
                        _id
                    }
                }
            `
        }


        fetch(config.URL, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed !!');
                }
                return res.json();
            })
            .then(data => {
                this.fetchBookings();

            })
            .catch(err => {
                console.log(err);
            })

    };

    render() {
        return (
            <React.Fragment>
                {this.state.isLoading ? <Spinner /> :
                    <BookingList bookings={this.state.bookings} onDelete={this.deleteBookingHandler} />
                }
            </React.Fragment>
        )
    }
}

export default BookingsPage
