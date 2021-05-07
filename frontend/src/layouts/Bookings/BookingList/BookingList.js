import React from 'react';

import './BookingList.css'

const bookingList = props => {
    return (
        <ul className="booking-list">
            {props.bookings.map(booking => {
                return (
                    <li key={booking._id} className="booking-item">
                        <div className="booking-item-data">
                            {booking.event.title} -- {new Date(booking.createdAt).toLocaleDateString()}
                        </div>
                        <div className="booking-item-actions">
                            <button className="btn" onClick={props.onDelete.bind(this, booking._id)}>Cancel Booking</button>
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}

export default bookingList;