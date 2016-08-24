var User = require('../models/user');
var Survey = require('../models/survey');
var Results = require('../models/result');
var config = require('../../config');
var secretKey = config.secretKey;
var jsonwebtoken = require('jsonwebtoken');

function createToken(user) {
    var token = jsonwebtoken.sign({
        id: user._id,
        name: user.name,
        username: user.username
    }, secretKey, {
        expiresInMinute: 1440
    });
    return token;
}

module.exports = function (app, express, io) {

    var api = express.Router();

//--------------------- User functions --------------------------

    //sign up user

    api.post('/signup', function (req, res) {
        var user = new User({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password
        });

        var token = createToken(user);

        user.save(function (err) {
            if (err) {
                res.send(err);
                return;
            }
            res.json({
                success: true,
                message: 'User has been created',
                token: token
            });
        });
    });

    //get all users

    api.get('/users', function (req, res) {

        User.find({}, function (err, users) {
            if (err) {
                res.send(err);
                return;
            }
            res.json(users);
        });
    });

    //user login

    api.post('/login', function (req, res) {

        User.findOne({
            username: req.body.username
        }).select('name username password').exec(function (err, user) {

            if (err) throw err;
            if (!user) {
                res.send({message: "User doesn't exist"});
            }
            else if (user) {
                var validPassword = user.comparePassword(req.body.password);
                if (!validPassword) {
                    res.send({message: "Invalid Password"});
                }
                else {
                    var token = createToken(user);
                    res.json({
                        success: true,
                        message: "Successfully logged in!",
                        token: token
                    });
                }
            }
        });
    });

//---------------------- Token verification ---------------------------

    //checking whether User is logged in
    //method from https://www.udemy.com/realtime-meanstack


    api.use(function (req, res, next) {

        var token = req.body.token || req.param('token') || req.headers['x-access-token'];

        // check if token exist
        if (token) {

            jsonwebtoken.verify(token, secretKey, function (err, decoded) {
                if (err) {
                    console.log("error one - failed auth");
                    res.status(403).send({success: false, message: "Failed to authenticate user"});
                }
                else {
                    req.decoded = decoded;
                    next();
                }
            });

            //mobile app routes not requiring verification

        }
        else if (!token && req.url == '/surveys' || '/surveys/:survey_id') {
            next();
        }
        else {
            res.status(403).send({success: false, message: "No Token Provided"});
        }
    });

    //get current user

    api.get('/me', function (req, res) {
        res.send(req.decoded);
    });


//---------------------- Survey functions ---------------------------


    api.route('/surveys')

        .get(function (req, res) {
            Survey.find({creator: req.decoded.id}, function (err, surveys) {
                if (err) {
                    res.send(err);
                    return;
                }
                res.json(surveys);
            });
        })

        .post(function (req, res) {
            var survey = new Survey({
                creator: req.decoded.id,
                Title: req.body.Title,
                Questions: req.body.Questions,
                Answers: req.body.Answers
            });

            survey.save(function (err) {
                if (err) {
                    res.send(err);
                    return;
                }
                res.json({
                    success: true,
                    message: 'Survey has been created!'
                });
            });
        });

//---------------------- Survey by ID functions ---------------------------


    api.route('/surveys/:survey_id')

        .get(function (req, res) {
            Survey.findById(req.params.survey_id, function (err, survey) {
                if (err) {
                    res.send(err);
                }
                res.json(survey);
            });
        })

        .put(function (req, res) {
            Survey.findById(req.params.survey_id, function (err, survey) {
                if (err)
                    res.send(err);

                survey.Title = req.body.Title;
                survey.Questions = req.body.Questions;
                survey.save(function (err) {
                    if (err)
                        res.send(err);

                    res.json({message: 'Survey updated!'})
                })
            })


        })

        .delete(function (req, res) {
            Survey.remove({
                _id: req.params.survey_id
            }, function (err, survey) {
                if (err)
                    res.send(err);
            });
        });

//---------------------- Results functions ---------------------------


    api.route('/results')

        .get(function (req, res) {
            Results.find({}, function (err, results) {
                if (err) {
                    res.send(err);
                    return;
                }
                res.json(results);
            });
        })

        .post(function (req, res) {
            var results = new Results({
                SurveyID: req.body.SurveyID,
                TimeStart: req.body.TimeStart,
                TimeFinish: req.body.TimeFinish,
                Responses: req.body.Responses
            });

            results.save(function (err) {
                if (err) {
                    res.send(err);
                    return;
                }
                res.json({
                    success: true,
                    message: 'New results created!!!'
                });
            });
        });


//---------------------- Results by ID functions ---------------------------


    api.route('/results/:survey_id')

        .get(function (req, res) {
            surveyID = req.params.survey_id;
            Results.find({SurveyID: surveyID}, function (err, results) {
                if (err) {
                    res.send(err);
                }
                res.json(results);
            });
        });


//-------------------------------------------------------------------------

    app.use('/api', api);

};