module.exports = function(app) {
    let request = require('request-promise');
    const cookieJar = request.jar();
    request = request.defaults({jar: cookieJar});
    const $ = require('cheerio');

    function lastElement(array) {
        return array.slice(0,array.length-4);
     }
     



    app.get('/tahmin/:id', (req,res) => {
        const ulke = req.params.id;
        const sample = "https://www.tahminanaliz.com/"+ ulke +"/";



        getRequest(sample, (html, next) => {
            try {
                
                const tables = $('.injurytable', html);
                var api = [];
                for(var i = 0; i < tables.length; i++) {
                    var tbody = $('tbody', tables[i]).children();
                    
                    var personals = [];
                    for(var j = 0; j < tbody.length; j++) {
                        var tr = $(tbody.eq(j));
                        var status = $('td', tr).eq(0).attr('class');
                        var name = $('td', tr).eq(1).text();
                        var date = $('td', tr).eq(2).text();
                        var finish = $('td', tr).eq(3).text();

                        if(name.length > 1) {
                            const player = {
                                'status' : status,
                                'name' : name,
                                'date': date,
                                'finish': finish
                            }
                            personals.push(player);
                        }
                    }
                    api.push(...personals);
                }
                var datas = lastElement(api);
                res.status(200).json(datas);

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
