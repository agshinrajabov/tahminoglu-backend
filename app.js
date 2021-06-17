var express           = require('express');
var path             = require('path');
var moment           = require('moment');
var bodyParser       = require('body-parser')
var helper           = require('./utilities/helper');
var makeImage        = require('./utilities/make-image');
var telegram         = require('./telegram');
var tahminAnaliz     = require('./pages/tahminAnaliz');
var oraniDusenler    = require('./pages/oraniDusenler');
var avrupadaTop10    = require('./pages/avrupadaTop10');
var session          = require('express-session');
var Guess            = require('./pages/add_guess/guess-add.js');
var History          = require('./pages/history.js');
var Register          = require('./pages/auth/register');
var compression      = require('compression');
var app              = express();
const puppeteer = require('puppeteer');
const $ = require('cheerio');
let request = require('request-promise');
const cookieJar = request.jar();
request = request.defaults({jar: cookieJar});
var session = require('express-session')
var MemoryStore = require('memorystore')(session)
 
require('./utilities/expressMongoDB');
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'hbs');
app.engine('hbs', helper.engine);
app.set('views', path.join(__dirname, 'views'));
app.use('/assets', express.static(path.join(__dirname, 'dist')));
Register(app);

app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    saveUninitialized: true,

    secret: 'keyboard cat'
}))
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

app.post('/login',  function(req,res) {

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

app.get('/guess', MatchSessionChecker, function (_, res) {
    Guess.find({}).lean().exec((err, data) => {
        if(err) {
            throw err;
        } 
        return res.render('guess', {guesses:data});
    });
});

app.get('/guess-add', MatchSessionChecker, function (_, res) {
    res.render('guess-add');
});

app.post('/guess-add', async function (req, res) {
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
    newGuess.save(async (err) => {
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
    Guess.findOneAndRemove({_id: id}).lean().exec((err, data) => {
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
    Guess.findById({_id: id}).lean().exec((err, data) => {
        if(!err) {
            return res.render('guess-add', {data: data, editable: 'true'});
         } else {
             console.log(err)
             return res.redirect('/guess')
         }
    });
});

app.post('/guess/edit/:id', function(req,res) {
    const id = req.params.id
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
    }).lean().exec((err, _) => {
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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.get('/settings', (_,res) => {
    res.json({
        "myBanner"        : false,
        "admobBanner"     : true,
        "giftDate"        : "7/8/2020",
        "bannerLink"      : "",
        "androidVersion"  : "1.1.8",
        "iosVersion"      : "1.3.0",
        "iosVersionUpdate": "1.3.0",
        "androidLink"     : "https://play.google.com/store/apps/details?id=com.shuffledev.tahoglu",
        "iosLink"         : "https://apps.apple.com/az/app/tahmino%C4%9Flu-i-ddaa-tahminleri/id1496838071",
    });
});

app.get('/link', function (_, res) {
    res.render('link');
});

app.get('/matchDetails/:id', async (req,res) => {
    const matchid = req.params.id;
    const url = `https://www.futbolverileri.com/match-detail/${matchid}/facts`;
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, {
          waitUntil: 'networkidle2',
        });

        const content = await page.content();

        const matchDetailsApi = [];

        $('.fact_row', content).each(function(_, item) {
            var txt = $('div', item).eq(1).text().trim();
            matchDetailsApi.push(txt);
        });

        res.json(matchDetailsApi);
      
        await browser.close();
});

app.get('/matchTrade/:id', async (req,res) => {
    const matchid = req.params.id;
    const url = `https://bahistv.com/bulten/trackerpage?matchcode=${matchid}`;
        const browser = await puppeteer.launch(
            {
                headless:true,
                args: [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
                  ]
            }
        );
        const page = await browser.newPage();

        await page.setJavaScriptEnabled(true);

        await page.goto(url, {
            waituntil: 'domcontentloaded',
        });

        const content = await page.content();

        var replaceContentScripts = content.replace('../Scripts/', 'https://bahistv.com/Scripts/');
        replaceContentScripts = replaceContentScripts.replace('../theme.css', 'https://bahistv.com/theme.css');
        replaceContentScripts = replaceContentScripts.replace('../Scripts/jquery-3.3.1.min.js', 'https://bahistv.com/Scripts/jquery-3.3.1.min.js');
        replaceContentScripts = replaceContentScripts.replace('http://www.bahistv.com/images/logo.png', 'https://is3-ssl.mzstatic.com/image/thumb/Purple124/v4/39/a6/09/39a609ab-a2b9-63bf-f70f-9b0e1bb6cb93/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/230x0w.png');
        replaceContentScripts = replaceContentScripts.replace('http://www.bahistv.com/images/logo.png', 'https://is3-ssl.mzstatic.com/image/thumb/Purple124/v4/39/a6/09/39a609ab-a2b9-63bf-f70f-9b0e1bb6cb93/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/230x0w.png');
        replaceContentScripts = replaceContentScripts.replace('http://www.bahistv.com/images/logo.png', 'https://is3-ssl.mzstatic.com/image/thumb/Purple124/v4/39/a6/09/39a609ab-a2b9-63bf-f70f-9b0e1bb6cb93/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/230x0w.png');

        var contentReplace = replaceContentScripts.replace('bahisgazetesilogo.png', 'https://is3-ssl.mzstatic.com/image/thumb/Purple124/v4/39/a6/09/39a609ab-a2b9-63bf-f70f-9b0e1bb6cb93/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/230x0w.png');

        res.send(contentReplace);
});

app.get('/haberler', (req,res) => {
    var url = 'https://www.mackolik.com/haberler/arsiv';
    


    getRequest(url, (html) => {
        
        const api = [];
         
        $('.widget-article-list__article', html).each(function(i, item) {
          var imageHtml = $('.widget-responsive-picture__img', item).eq(0);
          var img = imageHtml.text().toString();
          var haberImage = $('img', img).attr('src').trim();
          var haberTitle = $('.widget-article__teaser', item).eq(0).text();
          var haberLink = $('a.widget-article__link', item).eq(0).attr('href');         
         var haber = {
             title: haberTitle.trim(),
             link: haberLink,
             image: haberImage
         };

         api.push(haber);
        });

        res.json(api);        
    });
});

app.post('/haber', (req,res) => {
    const link = req.body.link;    
    getRequest(link, (html) => {
        var imageHtml = $('.widget-article__body', html).eq(0).text().trim();      
        res.end(imageHtml);        
    });
});


tahminAnaliz(app);

oraniDusenler(app);

avrupadaTop10(app);

function getRequest(url, callback) {
    // const cookieString = cookieJar.getCookieString('https://instagram.com/accounts/login');
  
    var options = {
        url: url, 
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
        },
        method: 'GET'
      }
    
      request(options).then((response) => {
        callback(response);
      });
}

app.listen(process.env.PORT || 4949);