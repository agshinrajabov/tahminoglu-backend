var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var guessAddSchema = new Schema({
    homeTeam: String,
    homeScore: String,
    guestTeam: String,
    awayScore: String,
    gameDate: String,
    gameCategory: String,
    gameLeague: String,
    gameStatus: Number,
    gameLiveMinute: Number,
    gameLive: String,
    gameVideo: String,
    gameInformations: String,
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