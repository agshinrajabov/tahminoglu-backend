var express = require('express');
var exphbs  = require('express3-handlebars');
var path = require('path');
var moment = require('moment');
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var mongoDB = require('./expressMongoDB');
var helper = require('./helper');
var makeImage = require('./make-image');
var telegram = require('./telegram');
var liveJSON = require('./live.json');
var scrape = require('./scrape');
var app = express();
var session = require('express-session');
var Guess = require('./guess-add.js');
var compression = require('compression');

app.set('view engine', 'hbs');
app.engine('hbs', helper.engine);
app.set('views', path.join(__dirname, 'views'));
app.use('/assets', express.static(path.join(__dirname, 'dist')))
app.use(session({secret: 'secret', resave: true,saveUninitialized: true}));
app.use(compression());

//Admin Login
const login = {
    username: 'seymur',
    password: 'Tahmin2020Seymur!!'
};

const sessionChecker = (req, res, next) => {
    if (req.session.loggedin && req.session.user) {
        if(req.session.role === 1) {
            res.redirect('/guess')
        }
    } else {
        next();
    }
};

const MatchSessionChecker = (req, res, next) => {
    if (req.session.loggedin && req.session.user) {
        if(req.session.role === 1) {
            next();
        }
    } else {
        res.redirect('/');
    }
};

app.get('/home', function (req, res) {
    res.render('home');
});

app.get('/privacy', function (req, res) {
    res.render('privacy');
});

app.get('/', sessionChecker, function (req, res) {
    res.render('login');
});

app.post('/', urlencodedParser, function(req,res) {

    var user = req.body.username;
    var pass = req.body.userpassword;
    
    if(user == login.username && pass == login.password) {
        req.session.loggedin = true;
        req.session.user = user;
        req.session.role = 1;
        return res.redirect('/home');
    } else {
       return res.render('login', {alert: "Daxil etdiyiniz istifadəçi adı və ya şifrə yanlışdır."});
    }
});

app.get('/notification', function (req, res) {
    res.render('notification');
});

app.get('/guess', MatchSessionChecker, function (req, res) {
    Guess.find({}, (err,data) => {
        if(err) {
            throw err;
        } 
        return res.render('guess', {guesses:data});
    });
});

app.get('/guess-add', MatchSessionChecker, function (req, res) {
    res.render('guess-add');
});

app.post('/guess-add', urlencodedParser, function (req, res) {
   var newGuess = new Guess({
        homeTeam: req.body.homeTeam,
        guestTeam: req.body.guestTeam,
        gameDate: moment(req.body.gameDate).format('DD MMMM'),
        gameStatus: req.body.gender,
        gameHour: req.body.gameHour,
        gameGuess: req.body.gameGuess,
        gameCoefficient: req.body.gameCoefficient,
        gameText: req.body.gameText,
    });
    makeImage(moment(req.body.gameDate).format('DD MMMM'), req.body.gameHour, req.body.homeTeam, req.body.guestTeam, req.body.gameCoefficient);
    newGuess.save((err) => {
        if(!err) {
            telegram('./dist/' + req.body.homeTeam + '_' + req.body.guestTeam + '.jpg');
            return res.render('success', {image: './dist/' + req.body.homeTeam + '_' + req.body.guestTeam + '.jpg'})
        } else {
            console.log(err);
            res.render('guess-add');
        }
    }) 
});

app.get('/guess/delete/:id', MatchSessionChecker, function(req,res) {
    const id = req.params.id
    //Find By Id
    Guess.findOneAndRemove({_id: id}, (err, data) => {
        if(!err) {
            return res.redirect('/guess')
        } else {
            console.log(err)
            return res.redirect('/guess')
        }
    });
});

app.get('/guess/edit/:id', MatchSessionChecker, function(req,res) {
    const id = req.params.id
    //Find By Id
    Guess.findById({_id: id}, (err, data) => {
        if(!err) {
           return res.render('guess-add', {data: data});
        } else {
            console.log(err)
            return res.redirect('/guess')
        }
    });
});

app.post('/guess/edit/:id', urlencodedParser, function(req,res) {
    const id = req.params.id
    //Find By Id
    Guess.findOneAndUpdate({_id: id}, {
        homeTeam: req.body.homeTeam,
        guestTeam: req.body.guestTeam,
        gameDate: moment(req.body.gameDate).format('DD MMMM'),
        gameStatus: req.body.gender,
        gameHour: req.body.gameHour,
        gameGuess: req.body.gameGuess,
        gameCoefficient: req.body.gameCoefficient,
        gameText: req.body.gameText,
    }, (err, data) => {
        if(!err) {
            return res.redirect('/guess')
        } else {
            console.log(err)
            return res.redirect('/guess')
        }
    });
});

app.get('/live', (req, res) => {
    res.json(liveJSON);
})

app.get('/api', (req,res) => {
    Guess.find({}, null, {sort: {createdDate: -1}}, (err,data) => {
        if(err) {
            throw err;
        }
        res.json(data);
    })
});

app.get('/updatedApi', (req,res) => {
    Guess.find({}, null, {sort: {createdDate: -1}}, (err,data) => {
        if(err) {
            throw err;
        }
        res.json(data);
    }).where('gameStatus').equals(1);
});

app.get('/settings', (req,res) => {
    res.json({
        "myBanner": false,
        "admobBanner": false, 
        "bannerLink": null
    });
});


app.get('/link', function (req, res) {
    res.render('link');
});

scrape(app);
 
app.listen(process.env.PORT || 4949);