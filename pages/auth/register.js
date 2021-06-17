const User = require('./user');
const Messages = require('../../utilities/messages');
const Bcrypt = require('bcryptjs')
const JsonWebToken = require('jsonwebtoken');
const SECRET_JWT_CODE = 'pxmZtua38RjNAhFp';

module.exports = (app) => {
    app.post('/user/signup', (req,res) => {
        if(!req.body.emailAdress || !req.body.password || !req.body.username){
            Messages.fail({}, "Send need params", function(CB) {
                res.send(CB)
                return;
            })
        }

        User.create({
            username: req.body.username,
            password: Bcrypt.hashSync(req.body.password, 10),
            emailAdress: req.body.emailAdress,
            country: req.body.country,
            favouriteTeam: req.body.favouriteTeam
        }).then((user) => {
            const token = JsonWebToken.sign({id: user._id, emailAdress: user.emailAdress}, SECRET_JWT_CODE);
            Messages.success({}, token, function(CB) {
                res.send(CB)
                return;
            })
        }).catch((err) => {
            Messages.fail({}, err, function(CB) {
                res.send(CB)
                return;
            });
        });
    });

    app.post('/user/login', (req,res) => {
        if(!req.body.emailAdress || !req.body.password){
            Messages.fail({}, "Send need params", function(CB) {
                res.send(CB)
                return;
            })
        }

        User.findOne({
            emailAdress: req.body.emailAdress,
        }).then((user) => {
            if(!user) {
                Messages.fail({}, "User does not exist", function(CB) {
                    res.send(CB)
                    return;
                })
            } else {
                if(!Bcrypt.compareSync(req.body.password, user.password)) {
                    Messages.fail({}, "Wrong password", function(CB) {
                        res.send(CB)
                        return;
                    })
                } else {
                    const token = JsonWebToken.sign({id: user._id, email: user.email}, SECRET_JWT_CODE);
                    Messages.success({}, token, function(CB) {
                        res.send(CB)
                        return;
                    })
                }
            }
        }).catch((err) => {
            Messages.fail({}, err, function(CB) {
                res.send(CB)
                return;
            });
        });
    });

    app.get('/example', (req,res) => {
        fetchUserByToken(req).then((user) => Messages.success({}, user, function(CB) {
            res.send(CB)
            return;
        })).catch((err) => Messages.fail({}, err, function(CB) {
            res.send(CB)
            return;
        }));
    });



}


function fetchUserByToken(req) {
    return new Promise((resolve, reject) => {
        if(req.headers && req.headers.authorization) {
            let authorization = req.headers.authorization;
            let decoded;
            try {
                decoded = JsonWebToken.verify(authorization, SECRET_JWT_CODE);
            } catch (e) {
                reject('Token not valid');
                return;
            }
            let userId = decoded.id;
            User.findOne({_id: userId}).then((user) => resolve(user)).catch((err) => reject(err))
        } else {
            reject('No token found');
        }
    });
}