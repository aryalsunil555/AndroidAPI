const mongoose = require('mongoose');

const Match = mongoose.model('Match', {
    place: {
        type: String

    },

    date: {
        type: String
    },
    score: {
        type: String
    },

    match: {
        type: String
    }
})

module.exports = Match;