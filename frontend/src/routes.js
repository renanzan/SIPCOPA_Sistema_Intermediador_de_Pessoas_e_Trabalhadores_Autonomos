import React from 'react';
// import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { BrowserRouter, Route } from 'react-router-dom';
// import { PrivateRoute } from './private.route';

import Header from './components/header/Header';
import Presentation from './pages/Home/Home';
import Connect from './pages/Connect/Connect';
import Service from './pages/Service/Service';
import MyAccount from './pages/My Account/MyAccount';
import NewJob from './pages/New Job/NewJob';
import ContractJob from './pages/Contract Job/ContractJob';
import History from './pages/History/History';
import ProfessionalProfileContracts from './pages/Professional Profile Contracts/ProfessionalProfileContracts';

export default function Routes() {
    return (
        <BrowserRouter>
            {/* <Switch> */}
                <Route path='' component={Header} />
                <Route exact path='/' component={Presentation} />
                <Route exact path='/connect' component={Connect} />
                <Route exact path='/service' component={Service} />
                <Route path='/my_account' component={MyAccount} />
                <Route path='/new_job' component={NewJob} />
                <Route path='/service/:userId/:jobId/contract' component={ContractJob} />
                <Route path='/history' component={History} />
                <Route path='/professional_profile/contracts' component={ProfessionalProfileContracts} />
                <Route exact path='/service/:professional_profile_id' component={() => {
                    return(
                        <div>
                            Ver trabalhador
                        </div>
                    );
                }} />
                <Route exact path='/service/:professional_profile_id/:job_id' component={() => {
                    return(
                        <div>
                            Ver trabalho
                        </div>
                    );
                }} />
            {/* </Switch> */}
        </BrowserRouter>
    );
}