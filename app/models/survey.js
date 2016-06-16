var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var AnswerSchema = new Schema({

    Text: String

});

var QuestionSchema = new Schema({

    Title: String,
    Type: String,
    Answers: [AnswerSchema]

});


var SurveySchema = new Schema({

    //UserID : [userSchema],//store user ID current logged in here and use this mongoose ref
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    Title: String,
    Questions: [QuestionSchema]

});



module.exports = mongoose.model('Survey', SurveySchema);