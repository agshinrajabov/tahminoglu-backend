module.exports = function(app) {
    let request = require('request-promise');
    const cookieJar = request.jar();
    request = request.defaults({jar: cookieJar});
    const $ = require('cheerio');

    const sample = "https://www.tahminanaliz.com/orani-dusen-maclar/";

    // rp(url)
    //   .then(function(html){
    //     //success!
    //     const api = [];
    //     const matches = $('#TLInc', html).eq(0).children();
    //    for (var i = 0; i < matches.length; i++) {
    //         var data = $(matches.eq(i), '.OranSatirF');
    //         var lig = $('.LigAdi', data).eq(0).text();
    //         var date = $('.GunTarih', data).eq(0).text();
    //         var homeTeam = $('.tr', data).eq(0).text();
    //         var awayTeam = $('.tl', data).eq(0).text();

    //         var oran = $('.Orans', data).children();
    //         var homeTeamFirst = oran.eq(0).text();
    //         var homeTeamSecond = oran.eq(1).text();
    //         var drawFirst = oran.eq(2).text();
    //         var drawSecond = oran.eq(3).text();
    //         var awayTeamFirst = oran.eq(4).text();
    //         var awayTeamSecond = oran.eq(5).text();     
    
            // const match = {
            //     'lig': lig.trim(),
            //     'date': date.trim(),
            //     'homeTeam': homeTeam.trim(),
            //     'awayTeam': awayTeam.trim(),
            //     'homeTeamFirst': homeTeamFirst.trim(),
            //     'homeTeamSecond': homeTeamSecond.trim(),
            //     'drawFirst': drawFirst.trim(),
            //     'drawSecond': drawSecond.trim(),
            //     'awayTeamFirst': awayTeamFirst.trim(),
            //     'awayTeamSecond': awayTeamSecond.trim(),
            // }
            // console.log(match);
    //         api.push(match);
    //    }
    //    var lastapi = api.filter((item) => item.homeTeamFirst != '');
    //    return res.json(lastapi);
       
    //   })
    //   .catch(function(err){
    //     //handle error
    //     console.log(err);
    //   });


    app.get('/oranidusenler', (req,res) => {
        getRequest(sample, (html, next) => {
            try {
                
                const rows = $('.post-single-content tbody', html).eq(0).children();
                console.log(rows.length);
                var api = [];

                    for(var j = 0; j < rows.length; j++) {
                        var tr = $(rows.eq(j));
                        var time = $('td', tr).eq(0).text();
                        var teams = $('td', tr).eq(1).text().trim().split('-');

                        var homeHtml = $('td', tr).eq(2).html();
                        var homeFirst = $('br', homeHtml).map(function(){
                            return this.previousSibling.nodeValue
                        })[0].trim();
                        var homeSecond = $('br', homeHtml).map(function(){
                            return this.nextSibling.nodeValue
                        })[0].trim();

                        var drawHtml = $('td', tr).eq(3).html();
                        var drawFirst = $('br', drawHtml).map(function(){
                            return this.previousSibling.nodeValue
                        })[0].trim();
                        var drawSecond = $('br', drawHtml).map(function(){
                            return this.nextSibling.nodeValue
                        })[0].trim();

                        var awayHtml = $('td', tr).eq(4).html();
                        var awayFirst = $('br', awayHtml).map(function(){
                            return this.previousSibling.nodeValue
                        })[0].trim();
                        var awaySecond = $('br', awayHtml).map(function(){
                            return this.nextSibling.nodeValue
                        })[0].trim();


                        const match = {
                            'time': time.trim(),
                            'homeTeam': teams[0].trim(),
                            'awayTeam': teams[1].trim(),
                            'home': `${homeFirst} ${homeSecond}`,
                            'draw': `${drawFirst} ${drawSecond}`,
                            'away': `${awayFirst} ${awaySecond}`,
                        }
                        // console.log(match);
                    api.push(match);
                }
                res.status(200).json(api);

            } catch(e) {
                console.log(e);
            }
        });
        
    });



function getRequest(url, callback) {
    // const cookieString = cookieJar.getCookieString('https://instagram.com/accounts/login');
    var options = {
      url: url, 
      timeout: 600000, // 10 min.
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
      },
      method: 'GET'
    }
    request(options).then((response) => {
      callback(response);
    });
}


}
