import React, { Component } from 'react';
import Modal from '../layouts/Modals/Modal';
import Backdrop from '../layouts/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import './Events.css';
import EventList from '../layouts/Events/EventList/EventList';
import Spinner from '../layouts/Spinner/Spinner';

const config = require('../assets/config.json');

class EventsPage extends Component {
    state = {
        creating: false,
        events: [],
        isLoading: false,
        selectedEvent: null
    };
    isActive = true;

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.titleElementRef = React.createRef();
        this.priceElementRef = React.createRef();
        this.dateElementRef = React.createRef();
        this.descriptionElementRef = React.createRef();
    }

    componentDidMount() {
        this.fetchEvents();
    }

    startCreateEventHandler = () => {
        this.setState({ creating: true });
    }

    modalConfirmHandler = () => {
        this.setState({ creating: false });
        const title = this.titleElementRef.current.value;
        const price = +this.priceElementRef.current.value;
        const date = this.dateElementRef.current.value;
        const description = this.descriptionElementRef.current.value;

        if (title.trim().length === 0 || price <= 0 || date.trim().length === 0 || description.trim().length === 0) {
            return;
        }
        const event = { title, price, date, description };
        console.log(event);

        const requestBody = {
            query: `
                mutation {
                    createEvent(eventInput: {title: "${title}", price: ${price}, date: "${date}", description: "${description}"}) {
                        _id
                        title
                        description
                        date
                        price
                    }
                }
            `
        }

        const token = this.context.token;

        fetch(config.URL, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed !!');
                }
                return res.json();
            })
            .then(data => {
                this.fetchEvents();

            })
            .catch(err => {
                console.log(err);
            })

    };

    modalCancelHandler = () => {
        this.setState({ creating: false, selectedEvent: null });
    };

    fetchEvents() {
        this.setState({ isLoading: true });
        const requestBody = {
            query: `
                query {
                    events {
                        _id
                        title
                        description
                        date
                        price
                        createdBy {
                            _id
                            email
                        }
                    }
                }
            `
        }


        fetch(config.URL, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed !!');
                }
                return res.json();
            })
            .then(data => {
                const events = data.data.events;
                if (this.isActive === true) {
                    this.setState({ events: events, isLoading: false });
                }
            })
            .catch(err => {
                if (this.isActive === true) {
                    this.setState({ isLoading: false });
                }
                console.log(err);
            })
    }

    showDetailHandler = eventId => {
        this.setState(prevState => {
            const selectedEvent = prevState.events.find(e => e._id === eventId);
            return { selectedEvent: selectedEvent };
        })
    }

    bookEventHandler = () => {
        const requestBody = {
            query: `
                mutation {
                    bookEvent(eventId: "${this.state.selectedEvent._id}") {
                        _id
                        createdAt
                        updatedAt
                    }
                }
            `
        }

        const token = this.context.token;

        fetch(config.URL, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed !!');
                }
                return res.json();
            })
            .then(data => {
                console.log(data);
                if (this.isActive === true) {
                    this.setState({ selectedEvent: null });
                }
            })
            .catch(err => {
                console.log(err);
                if (this.isActive === true) {
                    this.setState({ selectedEvent: null });
                }
            })
    }

    componentWillUnmount() {
        this.isActive = false;
    }

    render() {

        return (
            <React.Fragment>
                {(this.state.creating || this.state.selectedEvent) && (<Backdrop></Backdrop>)}
                {this.state.creating && (
                    <Modal title="Add Events" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler} confirmText="Confirm" showButton={this.context.token ? true : false}>
                        <form>
                            <div className="form-control">
                                <label htmlFor="title">Title</label>
                                <input type="text" id="title" ref={this.titleElementRef} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="price">Price</label>
                                <input type="number" id="price" ref={this.priceElementRef} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="date">Date</label>
                                <input type="datetime-local" id="date" ref={this.dateElementRef} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="description">Description</label>
                                <textarea rows="4" id="description" ref={this.descriptionElementRef}></textarea>
                            </div>
                        </form>
                    </Modal>
                )}
                {this.state.selectedEvent && (
                    <Modal title="Event Details" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.bookEventHandler} confirmText="Book Event" showButton={this.context.token ? true : false}>
                        <h1>{this.state.selectedEvent.title}</h1>
                        <h2>
                            &#8377;{this.state.selectedEvent.price} -- {new Date(this.state.selectedEvent.date).toLocaleDateString()}
                        </h2>
                        <p>{this.state.selectedEvent.description}</p>
                    </Modal>
                )}
                {this.context.token && (
                    <div className="events-control">
                        <p>Share your own Events !!</p>
                        <button className="btn" onClick={this.startCreateEventHandler}>Create Event</button>
                    </div>
                )}
                {this.state.isLoading ? <Spinner /> :
                    <EventList
                        events={this.state.events}
                        authUserId={this.context.userId}
                        onViewDetail={this.showDetailHandler}
                    />}

            </React.Fragment>
        )
    }
}

export default EventsPage
