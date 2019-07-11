const mongoose = require('mongoose');

const News = mongoose.model('News', {
    title1: {
        type: String
    },
    date: {
        type: String
    },
    imgfiles: {
        type: String
    },
    comment: {
        type: String
    }
})

module.exports = News;