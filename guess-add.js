var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var guessAddSchema = new Schema({
    homeTeam: String,
    homeScore: String,
    guestTeam: String,
    awayScore: String,
    gameDate: String,
    gameCategory: String,
    gameStatus: Number,
    gameHour: String,
    gameGuess: String,
    gameToken: Number,
    gameCoefficient: String,
    gameText: String,
    gameHistory: String,
    createdDate: Date
});

guessAddSchema.pre('save', function (next) {
    var current = new Date();
    this.createdDate = current;
    next();
})


var guessAddSchema = mongoose.model('Guess', guessAddSchema);

module.exports = guessAddSchema;