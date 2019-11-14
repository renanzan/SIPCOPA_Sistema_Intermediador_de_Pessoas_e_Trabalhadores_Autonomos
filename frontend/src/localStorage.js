export const LocalStorageToken = {
    keyItemName: {
        token: '@sipcopa/token',
        username: '@sipcopa/username',
        bitpoints: '@sipcopa/bitpoints'
    },

    set: (key, keyItem) => {
        localStorage.setItem(key, keyItem);
    },

    get: (key) => {
        return localStorage.getItem(key);
    },

    remove: (key) => {
        localStorage.removeItem(key);
    }
}