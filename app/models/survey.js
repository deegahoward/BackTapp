var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var SurveySchema = new Schema({

    title: String,
    questions: {
        question: {
            title: String,
            type: String,
            answers: {
                answer: {
                    text: String
                }
            }
        }

    }

});

module.exports = mongoose.model('Survey', SurveySchema);