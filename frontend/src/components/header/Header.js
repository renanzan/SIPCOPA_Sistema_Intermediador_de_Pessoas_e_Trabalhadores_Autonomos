import React, { useState, useEffect } from 'react';

import { isAuthenticated, logout, getUser } from '../../services/auth'

import './Header.css';
import Coin from '../../assets/icons/coin.svg';

const handleLogout = async (history) => {
    logout(history);
}

export default function Header(props) {
    const [authenticated, setAuthenticated] = useState(isAuthenticated());

    useEffect(() => {
        setAuthenticated(isAuthenticated());

    }, [isAuthenticated()]);

    const { history } = props;
    const {pathname} = props.location;

    return(
        <div className="header">
            <div className="left">
                <label className="logo">SIPCOPA</label>
                <TopNavigation pathname={pathname} history={history} />
            </div>
            <div className="right">
                <UserInfo history={history} authenticated={authenticated} />
                <Menu pathname={pathname} history={history} />
                <UserPoints authenticated={authenticated} />
            </div>
        </div>
    );
}

const Menu = ({ pathname, history }) => {
    return(
        <div className="menu">
            <ul>
                {
                    pathname === '/' ?
                        <li className="selected">Página inical</li> :
                        <li onClick={ () => {history.push('/')} }>Página inical</li>
                }
                {
                    pathname.toUpperCase().startsWith('/SERVICE') ?
                        <li className="selected">Serviço</li> :
                        <li onClick={ () => {history.push('/service/profissionais/Nome completo')} }>Serviço</li>
                }
                {
                    pathname === '/about' ?
                        <li className="selected">Sobre</li> :
                        <li onClick={ () => {history.push('/about')} }>Sobre</li>
                }
                {
                    pathname === '/connect' ?
                        <li className="selected">Conectar</li> :
                        <li onClick={ () => { history.push('/connect')} }>Conectar</li>
                }
            </ul>
        </div>
    );
}

const TopNavigation = ({ pathname, history }) => {
    const navigationPath = pathname.substring(1, pathname.lenght).split('/');

    const getNavigationPath = (currentIndex) => {
        var path = '';

        for(var count=0; count <= currentIndex; count++) {
            path += '/';
            path += navigationPath[count];
        }

        return path;
    }

    return(
        <div className="top-navigation" style={ !(pathname.toUpperCase().startsWith('/SERVICE')) ? { visibility:'hidden' } : null }>
            {
                navigationPath.map((element, index) => {
                    if(index !== navigationPath.length - 1)
                        return(
                            <label key={index}>
                                <label className="selectable" onClick={() => { history.push(getNavigationPath(index)) }}>
                                    {element}
                                </label>

                                <label style={{ margin:'0 20px'}}>/</label>
                            </label>
                        );
                    else
                        return(
                            <label key={index}>
                                <label style={{ color:'#2AABCC' }} className="selectable" onClick={() => { history.push(getNavigationPath(index)) }} >
                                    {element}
                                </label>
                            </label>
                        );
                })
            }
        </div>
    );
}

const UserInfo = ({ history, authenticated }) => {

    const [currentUser, setCurrentUser] = useState({});

    getUser().then((response) => {
        setCurrentUser(response);
    });

    console.log(currentUser);

    return(
        <div className='user-info-container' style={styleHiddenIfDesconected({}, authenticated)}>
            <label>conectado como {authenticated ? 'currentUser.username' : null }</label>
            <label className='btn-desconectar' onClick={(e) => {handleLogout(history)}}>desconectar</label>
        </div>
    );
}

const UserPoints = (authenticated) => {
    return(
        <div className="user-points-container" style={styleHiddenIfDesconected({}, authenticated.authenticated)}>
            <label>10.000</label>
            <img src={Coin} alt="Your coins" />
        </div>
    );
}

const styleHiddenIfDesconected = (style, authenticated) => {

    if(!authenticated)
        return Object.assign({}, style, { visibility:'hidden' });

    return style;
}