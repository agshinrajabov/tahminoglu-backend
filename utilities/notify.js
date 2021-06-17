var FCM = require('fcm-node');
var serviceAccount = require("../tahmin-master-firebase-adminsdk-e8nst-65cb671abf.json");
var fcm = new FCM(serviceAccount);
var collapseKey = 'new_message';
var message = {
    to: 'client_app_token',
    data: {
           cpeMac: '000000000000',
        type: 'malware' 
    },
    notification: {
        title: 'Hello motherfucker',
        body: 'Nice body',
        tag: collapseKey,
        icon: 'ic_notification',
        color: '#18d821',
        sound: 'default',
    },
};


fcm.send(message, function(err, response){
    if (err) {

        console.log(err);

    } else {
    }
})

console.log("END");