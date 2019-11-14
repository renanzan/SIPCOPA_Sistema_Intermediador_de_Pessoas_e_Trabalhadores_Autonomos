import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { isAuthenticated } from './services/auth';

export const PrivateRoute = ({ component:Component, ... res }) => {
    return (
        <Route { ...res} render = { props => (
            isAuthenticated() ? (
                <Component {...props} />
            ) : (
                <Redirect to={{
                    pathname: '/',
                    state: {
                        from: props.location
                    }
                }} />
            )
        )}/>
    );
};