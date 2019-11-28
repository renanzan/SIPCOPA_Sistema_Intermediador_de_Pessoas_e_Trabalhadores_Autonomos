import api from '../services/api';
import { LocalStorageToken } from '../localStorage';

var Authenticated = (LocalStorageToken.get(LocalStorageToken.keyItemName.token) === null) ? false : true;

export async function getUser() {
    const token = LocalStorageToken.get(LocalStorageToken.keyItemName.token);

    if(!token)
        return null;

    const response = await api.post('/auth/profile', {}, {
        headers: {
            "Content-Type": 'application/json',
            authentication : token
        }
    });

    return response;
}

export async function login(username, password, history, onError) {
    await api.post('/auth', {
        username,
        password
    }, {
        "Content-Type": 'application/json'
    })
    .then(response => {
        const { token } = response.data;

        LocalStorageToken.set(LocalStorageToken.keyItemName.token, token);

        Authenticated = true;

        history.push('/service');
    })
    .catch(error => {
        onError(error);
    });
};

export async function register(username, password, email, history, onError) {
    await api.post('/auth/register', {
        username,
        password,
        email
    }, {
        "Content-Type": 'application/json'
    })
    .then(response => {
        const { token } = response.data;

        LocalStorageToken.set(LocalStorageToken.keyItemName.token, token);

        Authenticated = true;

        history.push('/service');
    })
    .catch(error => {
        onError(error);
    });
};

export function logout(history) {
    LocalStorageToken.remove(LocalStorageToken.keyItemName.token);

    Authenticated = false;

    history.push('/');
}

export function isAuthenticated() {
    return Authenticated;
}