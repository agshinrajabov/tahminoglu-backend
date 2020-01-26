var express = require('express');
var exphbs  = require('express3-handlebars');
var path = require('path');
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var mongoDB = require('./expressMongoDB');
var app = express();
var Guess = require('./guess-add.js');
 
app.engine('hbs', exphbs({extname: '.hbs', defaultLayout: false, layoutsDir:'views'}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use('/assets', express.static(path.join(__dirname, 'dist')))

//Admin Login
const login = {
    username: 'Admin',
    password: '12345'
}

app.get('/home', function (req, res) {
    res.render('home');
});

app.get('/', function (req, res) {
    res.render('login');
});

app.post('/', urlencodedParser, function(req,res) {

    var user = req.body.username;
    var pass = req.body.userpassword;
    
    if(user == login.username && pass == login.password) {
        return res.redirect('/home');
    } else {
       return res.render('login', {alert: "Daxil etdiyiniz istifadəçi adı və ya şifrə yanlışdır."});
    }
});


app.get('/notification', function (req, res) {
    res.render('notification');
});

app.get('/guess', function (req, res) {
    Guess.find({}, (err,data) => {
        if(err) {
            throw err;
        } 
        return res.render('guess', {guesses:data});
    });
});

app.get('/guess-add', function (req, res) {
    res.render('guess-add');
});

app.post('/guess-add', urlencodedParser, function (req, res) {
   var newGuess = new Guess({
        homeTeam: req.body.homeTeam,
        guestTeam: req.body.guestTeam,
        gameDate: req.body.gameDate,
        gameStatus: req.body.gender,
        gameHour: req.body.gameHour,
        gameGuess: req.body.gameGuess,
        gameCoefficient: req.body.gameCoefficient
    });
    newGuess.save((err) => {
        if(err) {
            throw err;
        }
    });

    res.render('guess-add');
});
 
app.listen(process.env.PORT || 4949);