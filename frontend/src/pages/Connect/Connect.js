import React, { useState } from 'react';

import api from '../../services/api';
import { login, logout, isAuthenticated } from '../../services/auth'

import { InputText } from '../../components/custom/Input';
import Decorartion from '../../assets/decorations.svg';

const handleLogin = async (history, username, password) => {
    login(username, password, history, (err) => {
        console.log(err);
    });
}



export default function Connect({ history }) {
    const [state, setState] = useState(0);

    if(isAuthenticated())
        history.push('/service');

    return (
        <div className="main-container" >
            {/* <div className="content"> */}
                {
                    state === 0 ?
                        <Login history={history} setState={setState} /> :
                    <Register setState={setState} />
                }
                <img className="decoration" src={Decorartion} alt="decoration" />
            {/* </div> */}
        </div>
    );
}

const Login = ({ history, setState }) => {
    const [username, setUsername] = useState('renanzan');
    const [password, setPassword] = useState('12345678');

    return(
        <div className="account-main-container">
            <div className="account-container-part-two">
            <label className="caption">Bem vindo de volta!</label>
                <label className="title">Conecte-se.</label>
                
                <InputText value='Nome de Usuário' placeholder='Digite um nome de usuário' useState={username} setState={setUsername} style={{ marginTop: 50 }} />
                <InputText type='password' value='Senha Secreta' placeholder='Digite sua senha secreta' useState={password} setState={setPassword} style={{ marginTop: 20 }} />
                <button style={{ alignSelf: 'flex-end', marginTop:'60px' }} onClick={(e) => {handleLogin(history, username, password)}}>Conectar</button>
                <label className="error">Error</label>
            </div>
            <div className="account-container-part-one" style={{ marginLeft: '10%' }}>
                <label className="title">Bem Vindo</label>
                <label>Usuários cadastrados podem avaliar serviços contratados e anunciar trabalhos autônomos, conecte-se a esse grande ecosistema!</label>
                <button onClick={() => { setState(1) }}>Não possuo uma conta</button>
            </div>
        </div>
    );
}

const Register = ({ setState }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return(
        <div className="account-main-container">
            <div className="account-container-part-one">
                <label className="title">CADASTRE-SE</label>
                <label>Informe seu dados pessoais e cadastre-se como trabalhador autônomo para amplificar sua visibilidade no mercado de trabalho!</label>
                <button onClick={() => {setState(0)}}>Já possuo uma conta</button>
            </div>
            <div className="account-container-part-two" style={{ marginLeft: '10%' }}>
                <label className="caption">Você é novo por aqui?</label>
                <label className="title">Crie uma conta.</label>
                
                <InputText value='Nome de Usuário' placeholder='Digite um nome de usuário' useState={username} setState={setUsername} style={{ marginTop: 50 }} />
                <InputText value='E-mail' placeholder='Digite seu e-mail' useState={email} setState={setEmail} style={{ marginTop: 20 }} />
                <InputText type='password' value='Senha Secreta' placeholder='Digite sua senha secreta' useState={password} setState={setPassword} style={{ marginTop: 20 }} />
                <InputText type='password' value='Confirme sua senha secreta' placeholder='Digite novamente sua senha secreta' useState={confirmPassword} setState={setConfirmPassword} style={{ marginTop: 20 }} />
                <button style={{ alignSelf: 'flex-end', marginTop:'60px' }}>Concluir cadastro</button>
            </div>
        </div>
    );
}