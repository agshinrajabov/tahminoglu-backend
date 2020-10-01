module.exports = function(app) {
    let request = require('request-promise');
    const cookieJar = request.jar();
    request = request.defaults({jar: cookieJar});
    const $ = require('cheerio');

    const sample = "https://www.tahminanaliz.com/avrupa-top-10/";

    app.get('/avrupadatop10', (req,res) => {
        getRequest(sample, (html, next) => {
            try {
                
                const rows = $('.brs_col table tbody', html).eq(0).children();
                var api = [];

                    for(var j = 0; j < rows.length; j++) {
                        var tr = $(rows.eq(j));
                        var date = $('td', tr).eq(0).text();
                        var teams = $('td', tr).eq(1).text().trim().split('-');
                        var predict = $('td', tr).eq(2).text();
                        var bet = $('td', tr).eq(3).text();

                        const match = {
                            'date': date.trim(),
                            'homeTeam': teams[0].trim(),
                            'awayTeam': teams[1].trim(),
                            'predict': predict.trim(),
                            'bet': bet.trim(),
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
