import React from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../../context/auth-context';
import './MainNavigation.css';

const MainNavigation = (props) => {
    return (<AuthContext.Consumer>
        {(context) => {
            return (
                <header className="main-navigation">
                    <div className="main-navigation-logo">
                        <h1>Event Management</h1>
                    </div>
                    <nav className="main-navigation-item">
                        <ul>
                            {!context.token && (
                                <li>
                                    <NavLink to="/auth">Authenticate</NavLink>
                                </li>
                            )}
                            <li>
                                <NavLink to="/events">Events</NavLink>
                            </li>
                            {context.token && (
                                <React.Fragment>
                                    <li>
                                        <NavLink to="/bookings">Bookings</NavLink>
                                    </li>
                                    <li>
                                        <button onClick={context.logout}>Logout</button>
                                    </li>
                                </React.Fragment>
                            )}
                        </ul>
                    </nav>
                </header>
            )
        }}
    </AuthContext.Consumer>
    )
}

export default MainNavigation;
