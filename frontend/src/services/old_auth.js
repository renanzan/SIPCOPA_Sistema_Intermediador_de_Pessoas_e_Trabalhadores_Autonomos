class Auth {
    constructor() {
        this.loggedDataUser = {};
        this.authenticated = false;
    }

    login(dataUser) {
        this.authenticated = true;
        this.loggedDataUser = JSON.parse(dataUser);
    }

    logout(cb) {
        this.authenticated = false;
        cb()
    }

    isAuthenticated() {
        return this.authenticated;
    }

    getDataLoggedUser() {
        return this.loggedDataUser;
    }
}

export default new Auth();