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

module.exports = function(app, express, io) {


	var api = express.Router();



   //method to get all stories from the database

	api.get('/all_stories', function(req, res) {
		
		Story.find({}, function(err, stories) {
			if(err) {
				res.send(err);
				return;
			}
			res.json(stories);
		});
	});

    //method to post new user data on sign up to the database

	api.post('/signup', function(req, res) {

		var user = new User({
			name: req.body.name,
			username: req.body.username,
			password: req.body.password
		});
		var token = createToken(user);
		user.save(function(err) {
			if(err) {
				res.send(err);
				return;
			}

			res.json({ 
				success: true,
				message: 'User has been created!',
				token: token
			});
		});
	});


    //method to get all existing users from the database

	api.get('/users', function(req, res) {

		User.find({}, function(err, users) {
			if(err) {
				res.send(err);
				return;
			}

			res.json(users);

		});
	});

    //method to get all existing surveys from the database

    api.get('/surveys', function(req, res) {

        Survey.find({}, function(err, surveys) {
            if(err) {
                res.send(err);
                return;
            }
            console.log(surveys);
            res.json(surveys);

        });
    });

    //method to post new survey to the database

    api.post('/newSurvey', function(req, res) {


        var survey = new Survey({

            Title: req.body.Title,
            Questions: req.body.Questions

        });





        survey.save(function(err) {
            if(err) {
                res.send(err);
                return;
            }

            res.json({
                success: true,
                message: 'Survey has been created!'
            });
        });
    });


    //method to post information entered by user to verify against existing user in database

	api.post('/login', function(req, res) {

		User.findOne({ 
			username: req.body.username
		}).select('name username password').exec(function(err, user) {

			if(err) throw err;

			if(!user) {

				res.send({ message: "User doesn't exist"});
                console.log("User doesn't exist mate!")


			} else if(user){ 

				var validPassword = user.comparePassword(req.body.password);
                console.log("THIS WORKED OK!");


                if(!validPassword) {
					res.send({ message: "Invalid Password"});
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

	api.use(function(req, res, next) {


		console.log("Somebody just came to our app!");

		var token = req.body.token || req.param('token') || req.headers['x-access-token'];


		// check if token exist
		if(token) {

			jsonwebtoken.verify(token, secretKey, function(err, decoded) {

				if(err) {
					res.status(403).send({ success: false, message: "Failed to authenticate user"});

				} else {

					//
					req.decoded = decoded;
					next();
				}
			});
		} else {
			res.status(403).send({ success: false, message: "No Token Provided"});
		}

	});

	

	// this was the methods used for displaying and creating stories on the home page

	api.route('/')

        //creating a story

		.post(function(req, res) {

			var story = new Story({
				creator: req.decoded.id,
				content: req.body.content,

			});

			story.save(function(err, newStory) {
				if(err) {
					res.send(err);
					return
				}
				io.emit('story', newStory)
				res.json({message: "New Story Created!"});
			});
		})

        //getting existing stories based on the user logged in


		.get(function(req, res) {

			Story.find({ creator: req.decoded.id }, function(err, stories) {

				if(err) {
					res.send(err);
					return;
				}

				res.send(stories);
			});
		});

	api.get('/me', function(req, res) {
		res.send(req.decoded);
	});

    //method to get existing surveys from the databse

    api.get('/surveys', function(req, res) {

        Survey.find({}, function(err, surveys) {
            if(err) {
                res.send(err);
                return;
            }

            res.json(surveys);

        });
    });


	return api;


}