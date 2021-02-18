const admin = require('firebase-admin');
const serviceAccount = require('./service.json');

admin.initializeApp({
credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = {
    db: db,
    admin: admin
};
