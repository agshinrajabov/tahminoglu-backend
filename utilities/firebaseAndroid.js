const firebaseAndroidAdmin = require('firebase-admin');
const serviceAccount = require('../serviceAndroid.json');

firebaseAndroidAdmin.initializeApp({
    credential: firebaseAndroidAdmin.credential.cert(serviceAccount)
}, 'andorid');

const db = firebaseAndroidAdmin.firestore();

module.exports = {
    db: db,
    admin: firebaseAndroidAdmin
};
