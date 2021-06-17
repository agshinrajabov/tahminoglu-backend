var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {
        type: String,
        min: [6, 'Minimum 6 character'],
        required: true,
        trim: true
    },
    password: {
        type: String,
        min: [6, 'Minimum 6 character'],
        required: true
    },
    emailAdress: {
        type: String,
        required: true
    },
    country: {
        type: String,
    },
    favouriteTeam: {
        type: String,
    },
    createdDate: Date
}, {collection: 'users'});

userSchema.pre('save', function (next) {
    var current = new Date();
    this.createdDate = current;
    next();
})


var userSchema = mongoose.model('User', userSchema);

module.exports = userSchema;