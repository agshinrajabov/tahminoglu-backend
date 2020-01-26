var express = require('express');
var exphbs  = require('express3-handlebars');
var path = require('path');
var moment = require('moment');
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var mongoDB = require('./expressMongoDB');
var helper = require('./helper');
var app = express();
var session = require('express-session');
var Guess = require('./guess-add.js');
 
app.set('view engine', 'hbs');
app.engine('hbs', helper.engine);
app.set('views', path.join(__dirname, 'views'));
app.use('/assets', express.static(path.join(__dirname, 'dist')))
app.use(session({secret: 'secret', resave: true,saveUninitialized: true}));

//Admin Login
const login = {
    username: 'Admin',
    password: '12345'
}


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

    newGuess.save((err) => {
        if(!err) {
            return res.redirect('/guess')
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
        "bannerLink": "https://miro.medium.com/max/640/1*uyZqUA7yQuJYrHtuDv49Rw.jpeg"
    });
})
 
app.listen(process.env.PORT || 4949);