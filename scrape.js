module.exports = function(app) {
    var request = require('request');

    var header = {
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
        "x-rapidapi-key": "a0245dd02151a077a18b5d6293eb1964"
    };

    //Leage Numbers
    var premierLeague = 524;
    var bundesligaNumber = 754;
    var laligaNumber = 775;
    var serieANumber = 891;
    var league1Number = 525;
    var everdiseNumber = 566;
    var ligaproNumber = 766;
    var superligNumber = 782;
    var tffNumber = 779;
    var championsLeagueNumber = 530;
    var uefaNumber = 514;

    //LIG API
    const ligs = (league) => { 
        return "http://v2.api-football.com/fixtures/rounds/"+ league + "/current";
    }

    //Premier League
    var premier = new Promise((resolve, reject) => {

        var options = {
            url: ligs(premierLeague),
            headers: header
        };

        request(options, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    var data = JSON.parse(body);
                    // use data

                    const FixtureSeason = data.api.fixtures.toString();
                    var fixtureNumber = [];
                    request({url: "http://v2.api-football.com/fixtures/league/" + premierLeague + "/" + FixtureSeason + "?timezone=Asia/Baku", headers: header} , (error,response,body) => {
                        var fixtureNumbers = [];
                        if (!error && response.statusCode == 200) {
                            var data = JSON.parse(body);
                            var fixtures = data.api.fixtures;
                            for( var i in fixtures) {
                                fixtureNumbers.push(fixtures[i].fixture_id);
                            }
                        }
                        for(var j in fixtureNumbers) {
                            var fixtureID = fixtureNumbers[j];

                            request({url: "http://v2.api-football.com/predictions/" + fixtureID, headers:header}, (error,response, body) => {
                                if (!error && response.statusCode == 200) {
                                    var data = JSON.parse(body);
                                    var dataAPI = data.api.predictions;
                                    var predictions = [];
                                    for(var q in dataAPI) {
                                        resolve(dataAPI[q]);    
                                    }
                                }
                            });
                        }

                    });
                }
            });
    });

    //Bundesliga
    var bundesliga = new Promise((resolve, reject) => {

        var options = {
            url: ligs(bundesligaNumber),
            headers: header
        };

        request(options, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    var data = JSON.parse(body);
                    // use data

                    const FixtureSeason = data.api.fixtures.toString();
                    var fixtureNumber = [];
                    request({url: "http://v2.api-football.com/fixtures/league/" + bundesligaNumber + "/" + FixtureSeason + "?timezone=Asia/Baku", headers: header} , (error,response,body) => {
                        var fixtureNumbers = [];
                        if (!error && response.statusCode == 200) {
                            var data = JSON.parse(body);
                            var fixtures = data.api.fixtures;
                            for( var i in fixtures) {
                                fixtureNumbers.push(fixtures[i].fixture_id);
                            }
                        }
                        for(var j in fixtureNumbers) {
                            var fixtureID = fixtureNumbers[j];

                            request({url: "http://v2.api-football.com/predictions/" + fixtureID, headers:header}, (error,response, body) => {
                                if (!error && response.statusCode == 200) {
                                    var data = JSON.parse(body);
                                    var dataAPI = data.api.predictions;
                                    var predictions = [];
                                    for(var q in dataAPI) {
                                        resolve(dataAPI[q]);    
                                    }
                                }
                            });
                        }

                    });
                }
            });
    });

    var laliga = new Promise((resolve, reject) => {

        var options = {
            url: ligs(laligaNumber),
            headers: header
        };

        request(options, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    var data = JSON.parse(body);
                    // use data

                    const FixtureSeason = data.api.fixtures.toString();
                    var fixtureNumber = [];
                    request({url: "http://v2.api-football.com/fixtures/league/" + laligaNumber + "/" + FixtureSeason + "?timezone=Asia/Baku", headers: header} , (error,response,body) => {
                        var fixtureNumbers = [];
                        if (!error && response.statusCode == 200) {
                            var data = JSON.parse(body);
                            var fixtures = data.api.fixtures;
                            for( var i in fixtures) {
                                fixtureNumbers.push(fixtures[i].fixture_id);
                            }
                        }
                        for(var j in fixtureNumbers) {
                            var fixtureID = fixtureNumbers[j];

                            request({url: "http://v2.api-football.com/predictions/" + fixtureID, headers:header}, (error,response, body) => {
                                if (!error && response.statusCode == 200) {
                                    var data = JSON.parse(body);
                                    var dataAPI = data.api.predictions;
                                    var predictions = [];
                                    for(var q in dataAPI) {
                                        resolve(dataAPI[q]);    
                                    }
                                }
                            });
                        }

                    });
                }
            });
    });

    var seriaA = new Promise((resolve, reject) => {

        var options = {
            url: ligs(serieANumber),
            headers: header
        };

        request(options, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    var data = JSON.parse(body);
                    // use data

                    const FixtureSeason = data.api.fixtures.toString();
                    var fixtureNumber = [];
                    request({url: "http://v2.api-football.com/fixtures/league/" + serieANumber + "/" + FixtureSeason + "?timezone=Asia/Baku", headers: header} , (error,response,body) => {
                        var fixtureNumbers = [];
                        if (!error && response.statusCode == 200) {
                            var data = JSON.parse(body);
                            var fixtures = data.api.fixtures;
                            for( var i in fixtures) {
                                fixtureNumbers.push(fixtures[i].fixture_id);
                            }
                        }
                        for(var j in fixtureNumbers) {
                            var fixtureID = fixtureNumbers[j];

                            request({url: "http://v2.api-football.com/predictions/" + fixtureID, headers:header}, (error,response, body) => {
                                if (!error && response.statusCode == 200) {
                                    var data = JSON.parse(body);
                                    var dataAPI = data.api.predictions;
                                    var predictions = [];
                                    for(var q in dataAPI) {
                                        resolve(dataAPI[q]);    
                                    }
                                }
                            });
                        }

                    });
                }
            });
    });

    var league1 = new Promise((resolve, reject) => {

        var options = {
            url: ligs(league1Number),
            headers: header
        };

        request(options, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    var data = JSON.parse(body);
                    // use data

                    const FixtureSeason = data.api.fixtures.toString();
                    var fixtureNumber = [];
                    request({url: "http://v2.api-football.com/fixtures/league/" + league1Number + "/" + FixtureSeason + "?timezone=Asia/Baku", headers: header} , (error,response,body) => {
                        var fixtureNumbers = [];
                        if (!error && response.statusCode == 200) {
                            var data = JSON.parse(body);
                            var fixtures = data.api.fixtures;
                            for( var i in fixtures) {
                                fixtureNumbers.push(fixtures[i].fixture_id);
                            }
                        }
                        for(var j in fixtureNumbers) {
                            var fixtureID = fixtureNumbers[j];

                            request({url: "http://v2.api-football.com/predictions/" + fixtureID, headers:header}, (error,response, body) => {
                                if (!error && response.statusCode == 200) {
                                    var data = JSON.parse(body);
                                    var dataAPI = data.api.predictions;
                                    var predictions = [];
                                    for(var q in dataAPI) {
                                        resolve(dataAPI[q]);    
                                    }
                                }
                            });
                        }

                    });
                }
            });
    });

    var everdise = new Promise((resolve, reject) => {

        var options = {
            url: ligs(everdiseNumber),
            headers: header
        };

        request(options, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    var data = JSON.parse(body);
                    // use data

                    const FixtureSeason = data.api.fixtures.toString();
                    var fixtureNumber = [];
                    request({url: "http://v2.api-football.com/fixtures/league/" + everdiseNumber + "/" + FixtureSeason + "?timezone=Asia/Baku", headers: header} , (error,response,body) => {
                        var fixtureNumbers = [];
                        if (!error && response.statusCode == 200) {
                            var data = JSON.parse(body);
                            var fixtures = data.api.fixtures;
                            for( var i in fixtures) {
                                fixtureNumbers.push(fixtures[i].fixture_id);
                            }
                        }
                        for(var j in fixtureNumbers) {
                            var fixtureID = fixtureNumbers[j];

                            request({url: "http://v2.api-football.com/predictions/" + fixtureID, headers:header}, (error,response, body) => {
                                if (!error && response.statusCode == 200) {
                                    var data = JSON.parse(body);
                                    var dataAPI = data.api.predictions;
                                    var predictions = [];
                                    for(var q in dataAPI) {
                                        resolve(dataAPI[q]);    
                                    }
                                }
                            });
                        }

                    });
                }
            });
    });

    var ligaPro = new Promise((resolve, reject) => {

        var options = {
            url: ligs(ligaproNumber),
            headers: header
        };

        request(options, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    var data = JSON.parse(body);
                    // use data

                    const FixtureSeason = data.api.fixtures.toString();
                    var fixtureNumber = [];
                    request({url: "http://v2.api-football.com/fixtures/league/" + ligaproNumber + "/" + FixtureSeason + "?timezone=Asia/Baku", headers: header} , (error,response,body) => {
                        var fixtureNumbers = [];
                        if (!error && response.statusCode == 200) {
                            var data = JSON.parse(body);
                            var fixtures = data.api.fixtures;
                            for( var i in fixtures) {
                                fixtureNumbers.push(fixtures[i].fixture_id);
                            }
                        }
                        for(var j in fixtureNumbers) {
                            var fixtureID = fixtureNumbers[j];

                            request({url: "http://v2.api-football.com/predictions/" + fixtureID, headers:header}, (error,response, body) => {
                                if (!error && response.statusCode == 200) {
                                    var data = JSON.parse(body);
                                    var dataAPI = data.api.predictions;
                                    var predictions = [];
                                    for(var q in dataAPI) {
                                        resolve(dataAPI[q]);    
                                    }
                                }
                            });
                        }

                    });
                }
            });
    });

    var superlig = new Promise((resolve, reject) => {

        var options = {
            url: ligs(superligNumber),
            headers: header
        };

        request(options, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    var data = JSON.parse(body);
                    // use data

                    const FixtureSeason = data.api.fixtures.toString();
                    var fixtureNumber = [];
                    request({url: "http://v2.api-football.com/fixtures/league/" + superligNumber + "/" + FixtureSeason + "?timezone=Asia/Baku", headers: header} , (error,response,body) => {
                        var fixtureNumbers = [];
                        if (!error && response.statusCode == 200) {
                            var data = JSON.parse(body);
                            var fixtures = data.api.fixtures;
                            for( var i in fixtures) {
                                fixtureNumbers.push(fixtures[i].fixture_id);
                            }
                        }
                        for(var j in fixtureNumbers) {
                            var fixtureID = fixtureNumbers[j];

                            request({url: "http://v2.api-football.com/predictions/" + fixtureID, headers:header}, (error,response, body) => {
                                if (!error && response.statusCode == 200) {
                                    var data = JSON.parse(body);
                                    var dataAPI = data.api.predictions;
                                    var predictions = [];
                                    for(var q in dataAPI) {
                                        resolve(dataAPI[q]);    
                                    }
                                }
                            });
                        }

                    });
                }
            });
    });

    var tff = new Promise((resolve, reject) => {

        var options = {
            url: ligs(tffNumber),
            headers: header
        };

        request(options, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    var data = JSON.parse(body);
                    // use data

                    const FixtureSeason = data.api.fixtures.toString();
                    var fixtureNumber = [];
                    request({url: "http://v2.api-football.com/fixtures/league/" + tffNumber + "/" + FixtureSeason + "?timezone=Asia/Baku", headers: header} , (error,response,body) => {
                        var fixtureNumbers = [];
                        if (!error && response.statusCode == 200) {
                            var data = JSON.parse(body);
                            var fixtures = data.api.fixtures;
                            for( var i in fixtures) {
                                fixtureNumbers.push(fixtures[i].fixture_id);
                            }
                        }
                        for(var j in fixtureNumbers) {
                            var fixtureID = fixtureNumbers[j];

                            request({url: "http://v2.api-football.com/predictions/" + fixtureID, headers:header}, (error,response, body) => {
                                if (!error && response.statusCode == 200) {
                                    var data = JSON.parse(body);
                                    var dataAPI = data.api.predictions;
                                    var predictions = [];
                                    for(var q in dataAPI) {
                                        resolve(dataAPI[q]);    
                                    }
                                }
                            });
                        }

                    });
                }
            });
    });

    var championsLeagu = new Promise((resolve, reject) => {

        var options = {
            url: ligs(championsLeagueNumber),
            headers: header
        };

        request(options, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    var data = JSON.parse(body);
                    // use data

                    const FixtureSeason = data.api.fixtures.toString();
                    var fixtureNumber = [];
                    request({url: "http://v2.api-football.com/fixtures/league/" + championsLeagueNumber + "/" + FixtureSeason + "?timezone=Asia/Baku", headers: header} , (error,response,body) => {
                        var fixtureNumbers = [];
                        if (!error && response.statusCode == 200) {
                            var data = JSON.parse(body);
                            var fixtures = data.api.fixtures;
                            for( var i in fixtures) {
                                fixtureNumbers.push(fixtures[i].fixture_id);
                            }
                        }
                        for(var j in fixtureNumbers) {
                            var fixtureID = fixtureNumbers[j];

                            request({url: "http://v2.api-football.com/predictions/" + fixtureID, headers:header}, (error,response, body) => {
                                if (!error && response.statusCode == 200) {
                                    var data = JSON.parse(body);
                                    var dataAPI = data.api.predictions;
                                    var predictions = [];
                                    for(var q in dataAPI) {
                                        resolve(dataAPI[q]);    
                                    }
                                }
                            });
                        }

                    });
                }
            });
    });

    var uefa = new Promise((resolve, reject) => {

        var options = {
            url: ligs(uefaNumber),
            headers: header
        };

        request(options, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    var data = JSON.parse(body);
                    // use data

                    const FixtureSeason = data.api.fixtures.toString();
                    var fixtureNumber = [];
                    request({url: "http://v2.api-football.com/fixtures/league/" + uefaNumber + "/" + FixtureSeason + "?timezone=Asia/Baku", headers: header} , (error,response,body) => {
                        var fixtureNumbers = [];
                        if (!error && response.statusCode == 200) {
                            var data = JSON.parse(body);
                            var fixtures = data.api.fixtures;
                            for( var i in fixtures) {
                                fixtureNumbers.push(fixtures[i].fixture_id);
                            }
                        }
                        for(var j in fixtureNumbers) {
                            var fixtureID = fixtureNumbers[j];

                            request({url: "http://v2.api-football.com/predictions/" + fixtureID, headers:header}, (error,response, body) => {
                                if (!error && response.statusCode == 200) {
                                    var data = JSON.parse(body);
                                    var dataAPI = data.api.predictions;
                                    var predictions = [];
                                    for(var q in dataAPI) {
                                        resolve(dataAPI[q]);    
                                    }
                                }
                            });
                        }

                    });
                }
            });
    });

    app.get('/predictions', (req,res) => {
        Promise.all([premier, bundesliga, laliga, seriaA, league1, everdise, ligaPro, superlig, tff, championsLeagu, uefa]).then((result) => {
            res.json(result);
        });

    });

}