const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/LiveScore', {      //task-manager-api = name of database
    useNewUrlParser: true,
    useCreateIndex: true

});