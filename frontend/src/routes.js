import React from 'react';
// import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { BrowserRouter, Route } from 'react-router-dom';
// import { PrivateRoute } from './private.route';

import Header from './components/Header/Header';
import Presentation from './pages/Home/Home';
import Connect from './pages/Connect/Connect';
import Service from './pages/Service/Service';
import MyAccount from './pages/My Account/MyAccount';
import NewJob from './pages/New Job/NewJob';

export default function Routes() {
    return (
        <BrowserRouter>
            {/* <Switch> */}
                <Route path='' component={Header} />
                <Route exact path='/' component={Presentation} />
                <Route exact path='/connect' component={Connect} />
                <Route path='/service' component={Service} />
                <Route path='/my_account' component={MyAccount} />
                <Route path='/new_job' component={NewJob} />
            {/* </Switch> */}
        </BrowserRouter>
    );
}