var User = require('../models/user');
var Survey = require('../models/survey');
var Results = require('../models/result');
var Count = require('../models/count');


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

    //method to get all existing users from the database

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


    api.get('/users', function (req, res) {

        User.find({}, function (err, users) {
            if (err) {
                res.send(err);
                return;
            }

            res.json(users);

        });
    });

    //method to post information entered by user to verify against existing user in database

    api.post('/login', function (req, res) {

        User.findOne({
            username: req.body.username
        }).select('name username password').exec(function (err, user) {

            if (err) throw err;

            if (!user) {

                res.send({message: "User doesn't exist"});
                console.log("User doesn't exist mate!")


            } else if (user) {

                var validPassword = user.comparePassword(req.body.password);
                console.log("THIS WORKED OK!");


                if (!validPassword) {
                    res.send({message: "Invalid Password"});
                } else {

                    ///// token
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


    //method to create token for time logged in and for users visiting pages without access provided

    api.use(function (req, res, next) {


        console.log("Somebody just came to our app!");

        var token = req.body.token || req.param('token') || req.headers['x-access-token'];

        // check if token exist
        if (token) {

            jsonwebtoken.verify(token, secretKey, function (err, decoded) {

                if (err) {
                    console.log("error one - failed auth");
                    res.status(403).send({success: false, message: "Failed to authenticate user"});
                } else {


                    req.decoded = decoded;

                    next();
                }
            });
        } else if (!token && req.url == '/surveys' || '/surveys/:survey_id') {

            next();
        } else {
            console.log("error two - no toke");
            console.log(req.url);
            console.log(req.path);

            res.status(403).send({success: false, message: "No Token Provided"});
        }


    });


    // this was the methods used for displaying and creating stories on the home page


    api.get('/me', function (req, res) {
        res.send(req.decoded);
    });


    //method to get all existing surveys from the database

    api.route('/surveys')

        .get(function (req, res) {

            console.log(req.decoded);

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

            console.log(survey);

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


    api.route('/surveys/:survey_id')


        .get(function (req, res) {

            console.log('success');

            Survey.findById(req.params.survey_id, function (err, survey) {
                if (err) {
                    res.send(err);
                }
                console.log(survey);
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

            console.log("deleting...");

            Survey.remove({

                _id: req.params.survey_id
            }, function (err, survey) {
                if (err)
                    res.send(err);

            });

        });

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

            console.log(req.body.SurveyID);
            console.log(req.body.Responses);
            console.log(req.body.TimeStart);
            console.log(req.body.TimeFinish);

            var results = new Results({

                SurveyID: req.body.SurveyID,
                TimeStart: req.body.TimeStart,
                TimeFinish: req.body.TimeFinish,
                Responses: req.body.Responses

            });

            console.log(results);

            results.save(function (err) {
                if (err) {
                    console.log(err);
                    res.send(err);
                    return;
                }

                res.json({
                    success: true,
                    message: 'New results created!!!'
                });
            });
        });

    api.route('/results/:survey_id')

        .get(function (req, res) {
            surveyID = req.params.survey_id;
            Results.find({SurveyID: surveyID}, function (err, results) {
                console.log(results);

                if (err) {
                    console.log(err);
                    res.send(err);
                }
                res.json(results);
            });
        });

    api.route('/count')

        .post(function (req, res) {

            console.log(req.body.ID);
            console.log(req.body.count);

            var count = new Count({

                id: req.body.ID,
                Count: req.body.count
            });

            console.log(count);

            count.save(function (err) {
                if (err) {
                    console.log(err);
                    res.send(err);
                    return;
                }

                res.json({
                    success: true,
                    message: 'New count submitted!'
                });
            });

        });


    api.route('/count/:count_id')

        .get(function (req, res) {

            console.log(req.params.count_id);

            Count.findById(req.params.count_id, function (err, count) {

                if (err) {

                    console.log(err);
                    res.send(err);
                }
                console.log("no");
                res.json(count);
            })

        })

        .put(function (req, res) {


            Count.findById(req.params.count_id, function (err, count) {
                if (err)
                    res.send(err);

                console.log(count);

                count.Count = req.body.Count;
                count.StartTimeArray.push(Date.now());

                count.save(function (err) {
                    if (err)
                        res.send(err);

                    res.json({message: 'Count updated!'})
                })
            })


        });

    api.route('/answers/:answer_id')

        .get(function (req, res) {

            Results.count({
                SurveyID: '5788fdadd5bc16726a6fb1d4'
            }, function (err, result) {
                if (err) {
                    next(err);
                } else {
                    console.log(result);
                    res.json(result);
                }
            });

        });


    app.use('/api', api);

};