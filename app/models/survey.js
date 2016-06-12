var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var AnswerSchema = new Schema({

    text: String

});

var QuestionSchema = new Schema({

    title: String,
    type: String,
    answers: [AnswerSchema]

});


var SurveySchema = new Schema({

    title: String,
    questions: [QuestionSchema]

});



module.exports = mongoose.model('Survey', SurveySchema);