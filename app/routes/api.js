var User = require('../models/user');
var Story = require('../models/story');
var Survey = require('../models/survey');

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

        var securePaths = ['/example', '/example/home', '/example/mobile'];


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
        } else if (req.url == "/thisSurvey") {

            next();
        } else {
            console.log("error two - no toke");
            console.log(req.pathname);


            res.status(403).send({success: false, message: "No Token Provided"});
        }


    });


    // this was the methods used for displaying and creating stories on the home page


    api.get('/me', function (req, res) {
        res.send(req.decoded);
    });


    //method to get all existing surveys from the database

    api.get('/surveys', function (req, res) {

        console.log(req.decoded);

        Survey.find({/*creator: req.decoded.id*/}, function (err, surveys) {
            if (err) {
                res.send(err);
                return;
            }

            res.json(surveys);

        });
    });


    api.get(function (req, res) {

        Survey.findById(req.params.survey_id, function (err, survey) {
            if (err)
                res.send(err);
            res.json(survey);

        });

    });

    api.delete('/deleteSurvey/:id', function (req, res) {
        try {
            surveyFactory.remove(req.body.id);
            res.send(200);
        } catch (exeception) {
            response.send(404);
        }

    });


    //method to get specific survey based on url params

    /*  api.get('/thisSurvey', function (req, res) {

     console.log(req.param('id'));

     Survey.find({id: req.body.surveyID}, function (err, survey) {
     if (err) {
     console.log(err);
     res.send(err);
     return;
     }

     res.json(survey);
     });

     });*/


//method to post new survey to the database

    api.post('/newSurvey', function (req, res) {


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


    app.use('/api', api);


};