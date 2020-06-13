var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var historySchema = new Schema({
    homeTeam: String,
    homeScore: String,
    guestTeam: String,
    awayScore: String,
    gameDate: String,
    gameStatus: Number,
    gameHour: String,
    gameGuess: String,
    gameToken: Number,
    gameCoefficient: String,
    gameCategory: String,
    gameText: String,
    gameHistory: String,
    createdDate: Date
});

historySchema.pre('save', function (next) {
    var current = new Date();
    this.createdDate = current;
    next();
})


var history = mongoose.model('History', historySchema);

module.exports = history;