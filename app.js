var express          = require('express');
var path             = require('path');
var moment           = require('moment');
var bodyParser       = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var helper           = require('./helper');
var makeImage        = require('./make-image');
var telegram         = require('./telegram');
var scrape           = require('./scrape');
var session          = require('express-session');
var Guess            = require('./guess-add.js');
var History          = require('./history.js');
var compression      = require('compression');
var request          = require('request');
var app              = express();

require('./expressMongoDB');
app.set('view engine', 'hbs');
app.engine('hbs', helper.engine);
app.set('views', path.join(__dirname, 'views'));
app.use('/assets', express.static(path.join(__dirname, 'dist')))
app.use(session({secret: 'secret', resave: true,saveUninitialized: true}));
app.use(compression());

var androidNotificationList = new Promise((resolve, reject) => {
    var options = {
    'method': 'GET',
    'url'   : 'https://tahminoglu-banko-maclar.firebaseio.com/notifications.json',
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        resolve(response.body);
    });
}); 


app.get('/iosnotifications', (_,res) => {
    Promise.all([androidNotificationList]).then((result) => {

        var options = {
            'method': 'GET',
            'url'   : 'https://tahminoglu-6b712.firebaseio.com/notifications.json',
            };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            var iosNotifications = [];
            var iosList          = JSON.parse(response.body);


            for(var item in iosList) {
                for(var val in iosList[item]) {
                    iosNotifications.push(iosList[item][val]);
                }
            }
            res.send(iosNotifications);
        });
    });
});

app.get('/androidnotifications', (_,res) => {
    Promise.all([androidNotificationList]).then((result) => {
        var androidList          = JSON.parse(result);
        var androidNotifications = [];
        for(var atem in androidList) {
            for(var val in androidList[atem]) {
                androidNotifications.push(androidList[atem][val]);
            }
        }
        res.send(androidNotifications);
    });
});


function sendAndroidNotification(title, message, token){
    var options = {
        'method' : 'POST',
        'url'    : 'https://fcm.googleapis.com/fcm/send',
        'headers': {
          'Content-Type' : 'application/json',
          'Authorization': 'key=AAAA3buZblE:APA91bFLjxyAtmpfhi7OEI64MASfTZU1mQGiPVB-TZa5qcVSOSCdS08ox1l3cdrTF4ScTky6T7n3E-83pBUeQO8p9tHsvKwJ_taGqYhp9wGbVsxAqHlDBdl121jdmG9AK-ce0JZ2PAbP'
        },
        body: JSON.stringify({"notification":{"title":title,"body":message},"data":{"click_action":"FLUTTER_NOTIFICATION_CLICK","type":"COMMENT"},"to":token})
      
      };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
        console.log(response.statusCode);
        console.log(response.statusMessage);
        console.log("_____________");
    });
}


function sendiOSNotification(title, message, token){
    console.log(title);
    console.log(message);
    console.log(token);
    var options = {
        'method' : 'POST',
        'url'    : 'https://fcm.googleapis.com/fcm/send',
        'headers': {
          'Content-Type' : 'application/json',
          'Authorization': 'key=AAAAt1vyJPo:APA91bG0GFz5DVB33S0U42aEE-nuRZklGDYLz6loffiPXjMuLuNusVlXu71bPmB97de_Fbz0P8z2H_CtYCNR2ZCjWtOhzzPtbLEOwVA13jaPLj-NcMLD_s7w87uWJtNUdFe80tyvJ1Yw'
        },
        body: JSON.stringify({"notification":{"title":title,"body":message},"data":{"click_action":"FLUTTER_NOTIFICATION_CLICK","type":"COMMENT"},"to":token})
      
      };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
        console.log(response.statusCode);
        console.log(response.statusMessage);
        console.log("_____________");
    });
}


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
        res.redirect('/login');
    }
};

app.get('/home', sessionChecker, function (_, res) {
    res.render('home');
});

app.get('/privacy', function (_, res) {
    res.render('privacy');
});

app.get('/', function (_, res) {
    res.render('link');
});

app.get('/login', sessionChecker, function (_, res) {
    res.render('login');
});

app.get('/terms', sessionChecker, function (_, res) {
    res.render('terms');
});

app.post('/login', urlencodedParser, function(req,res) {

    var user = req.body.username;
    var pass = req.body.userpassword;
    
    if(user == login.username && pass == login.password) {
        req.session.loggedin = true;
        req.session.user     = user;
        req.session.role     = 1;
        return res.redirect('/home');
    } else {
       return res.render('login', {alert: "Daxil etdiyiniz istifadəçi adı və ya şifrə yanlışdır."});
    }
});

app.get('/notification', function (_, res) {
    res.render('notification');
});

app.get('/guess', MatchSessionChecker, function (_, res) {
    Guess.find({}, (err,data) => {
        if(err) {
            throw err;
        } 
        return res.render('guess', {guesses:data});
    });
});

app.get('/guess-add', MatchSessionChecker, function (_, res) {
    res.render('guess-add');
});

app.post('/guess-add', urlencodedParser, function (req, res) {
   var newGuess = new Guess({
        homeTeam       : req.body.homeTeam,
        guestTeam      : req.body.guestTeam,
        gameDate       : moment(req.body.gameDate).format('DD MMMM'),
        gameStatus     : req.body.gender,
        gameHour       : req.body.gameHour,
        gameGuess      : req.body.gameGuess,
        gameToken      : req.body.gameToken,
        gameCoefficient: req.body.gameCoefficient,
        gameText       : req.body.gameText,
        gameCategory   : req.body.category,
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
        if(!err && data != null) {
            return res.redirect('/guess')
        } else {
            console.log(err)
            return res.redirect('/guess')
        }
    });
});

app.get('/guess/edit/:id',  function(req,res) {
    const id = req.params.id
    //Find By Id
    Guess.findById({_id: id}, (err, data) => {
        if(!err) {
           return res.render('guess-add', {data: data, editable: 'true'});
        } else {
            console.log(err)
            return res.redirect('/guess')
        }
    });
});

app.post('/guess/edit/:id', urlencodedParser, function(req,res) {
    const id = req.params.id

    if(req.body.gender == 1) {
        var iosOptions = {
            'method': 'GET',
            'url'   : 'http://tahmin-master.herokuapp.com/iosnotifications',
          };
          request(iosOptions, function (error, response) {
            if (error) throw new Error(error);
            var iosNotiifcationList = JSON.parse(response.body);
            var homeName            = req.body.homeTeam;
            var awayName            = req.body.guestTeam;
            var fullTeamNames       = homeName + " - " + awayName;
    
            var list = iosNotiifcationList.filter(element => element['match'] == fullTeamNames);

            for(var match in list) {
                sendiOSNotification("Tebrikler!", "Yaptığımız " + fullTeamNames + " maçı tahmini kazanmıştır! 😍", list[match]['token']);
            }
    
          });

          //Şahbaz: Əhləmdulillah

          var androidOptions = {
            'method': 'GET',
            'url'   : 'http://tahmin-master.herokuapp.com/androidnotifications',
          };
          request(androidOptions, function (error, response) {
            if (error) throw new Error(error);
            var androidNotificationList = JSON.parse(response.body);
            var homeName                = req.body.homeTeam;
            var awayName                = req.body.guestTeam;
            var fullTeamNames           = homeName + " - " + awayName;
    
            var androidList = androidNotificationList.filter(element => element['match'] == fullTeamNames);

            for(var mat in androidList) {
                sendAndroidNotification("Tebrikler!", "Yaptığımız " + fullTeamNames + " maçı tahmini kazanmıştır! 😍", androidList[mat]['token']);
            }
    
          });
    }
    //Find By Id
    Guess.findOneAndUpdate({_id: id}, {
        homeTeam       : req.body.homeTeam,
        homeScore      : req.body.homeScore,
        guestTeam      : req.body.guestTeam,
        awayScore      : req.body.awayScore,
        gameDate       : moment(req.body.gameDate).format('DD MMMM'),
        gameStatus     : req.body.gender,
        gameHour       : req.body.gameHour,
        gameGuess      : req.body.gameGuess,
        gameToken      : req.body.gameToken,
        gameCoefficient: req.body.gameCoefficient,
        gameText       : req.body.gameText,
        gameCategory   : req.body.category,
        gameHistory    : req.body.historical,
    }, (err, data) => {
        if(!err) {
            if(req.body.historical) {
                var histor = new History({
                    homeTeam       : req.body.homeTeam,
                    homeScore      : req.body.homeScore,
                    guestTeam      : req.body.guestTeam,
                    awayScore      : req.body.awayScore,
                    gameDate       : moment(req.body.gameDate).format('DD MMMM'),
                    gameStatus     : req.body.gender,
                    gameHour       : req.body.gameHour,
                    gameGuess      : req.body.gameGuess,
                    gameToken      : req.body.gameToken,
                    gameCoefficient: req.body.gameCoefficient,
                    gameText       : req.body.gameText,
                    gameCategory   : req.body.category,
                    gameHistory    : req.body.historical,
                });
                histor.save((err) => {
                    if(!err) {
                        console.log("True");
                    } else {
                        console.log(err);
                    }
                }) 
            }
            return res.redirect('/guess')
        } else {
            console.log(err)
            return res.redirect('/guess')
        }
    });
});

app.get('/api', (_,res) => {
    Guess.find({}, null, {sort: {createdDate: -1}}, (err,data) => {
        if(err) {
            throw err;
        }
        res.json(data);
    })
});

app.get('/histories', (_,res) => {
    History.find({}, null, {sort: {createdDate: -1}}, (err,data) => {
        if(err) {
            throw err;
        }
        res.json(data);
    })
});

app.get('/updatedApi', (_,res) => {
    Guess.find({}, null, {sort: {createdDate: -1}}, (err,data) => {
        if(err) {
            throw err;
        }
        res.json(data);
    }).where('gameStatus').equals(1);
});

app.get('/settings', (_,res) => {
    res.json({
        "myBanner"      : false,
        "admobBanner"   : true,
        "giftDate"      : "7/8/2020",
        "bannerLink"    : "",
        "androidVersion": "1.1.3",
        "iosVersion"    : "1.2.7",
        "iosVersionUpdate"    : "1.2.9",
        "androidLink"   : "https://play.google.com/store/apps/details?id=com.shuffledev.tahoglu",
        "iosLink"       : "https://apps.apple.com/az/app/tahmino%C4%9Flu-i-ddaa-tahminleri/id1496838071",
    });
});

app.get('/link', function (_, res) {
    res.render('link');
});

scrape(app);

app.listen(process.env.PORT || 4949);