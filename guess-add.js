var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var guessAddSchema = new Schema({
    homeTeam: String,
    guestTeam: String,
    gameDate: String,
    gameStatus: Number,
    gameHour: String,
    gameGuess: String,
    gameCoefficient: String,
    createdDate: Date
});

guessAddSchema.pre('save', function (next) {
    var current = new Date();
    this.createdDate = current;
    next();
})


var guessAddSchema = mongoose.model('Guess', guessAddSchema);

module.exports = guessAddSchema;