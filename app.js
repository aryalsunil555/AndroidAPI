const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')
const app = express();
const multer = require('multer')
const cors = require('cors');
require('./db/mongoose');
const Users = require('./models/user');

const Users3 = require('./models/news');
const Users4 = require('./models/match');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
const middleware = require('./middleware/middleware');
const auth = require('./middleware/auth');
app.use("/img", express.static("./img"));


app.get('/mytest', auth, function () {
    res.send("this is my private page")
})
// User Register USERDATA


app.post('/user_register', function (req, res) {

    var fname = req.body.fname;
    var contact = req.body.contact;
    var address = req.body.address;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;

    /// variable name : htmlform name

    var User_register = new Users({

        'fname': fname,
        'contact': contact,
        'address': address,
        'email': email,
        'username': username,
        'password': password

        // database name:  variable name

    });
    User_register.save().then(function () {
        console.log("successfully.");
        res.send("Player Added");
    }).catch(function (e) {
        res.send(e)

    })
});




// login 
app.get('./users/me', auth, function (req, res) {
    res.send(req.user);
})

app.post("/login77", async function (req, res) {

    // username is boady name
    const user = await Users.checkCrediantialsDb(req.body.username, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ token });
    console.log(user);
    console.log("Login Sucessful.");



})

//Player Image
////////////
var storage1 = multer.diskStorage({
    destination: "img",
    filename: (req, file, callback) => {
        let ext = path.extname(file.originalname);
        callback(null, "sunil" + Date.now() + ext);
    }
});

var imageFileFilter1 = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb("Only image files accepted!!"), false;
    }
    cb(null, true);
};

var upload1 = multer({
    storage: storage1,
    fileFilter: imageFileFilter1,
    limits: { fileSize: 1000000 }
});


// News  Image
////////
var storage = multer.diskStorage({
    destination: "img",
    filename: (req, file, callback) => {
        let ext = path.extname(file.originalname);
        callback(null, "sunil" + Date.now() + ext);
    }
});

var imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb("Only image files accepted!!"), false;
    }
    cb(null, true);
};

var upload = multer({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 1000000 }
});


app.post('/upload_image', upload.single('imageFile'), (req, res) => {

    res.send(req.file);
    console.log(req.file);

})


/// News ADD
app.post('/NewsAdd', function (req, res) {

    var title1 = req.body.title1;
    var imgfiles = req.body.imgfiles;
    var comment = req.body.comment;
    var date = req.body.date;

    var news = new Users3({
        'title1': title1,
        'imgfiles': imgfiles,
        'comment': comment,
        'date': date
    });
    news.save().then(function () {
        console.log("News added successfully.");
        res.send("news added.");
    }).catch(function (e) {
        res.send(e)

    })
});




//////////////////////
// Add Match
app.post('/match', function (req, res) {
    console.log(req.body);
    var myData = new Users4(req.body);
    myData.save().then(function () {
        res.send({ sucess: true });

    }).catch(function (e) {
        res.send(e)
    })
})


app.get('/getMatchdata', function (req, res) {
    Users4.find().then(function (matchdata) {
        res.send(matchdata);
        console.log("Getting Match Data");
        console.log(matchdata);
    }).catch(function (e) {
        res.send(e)
    });
})



// GET News

app.get('/getNewshdata', function (req, res) {
    Users3.find().then(function (newshdata) {
        res.send(newshdata);
    }).catch(function (e) {
        res.send(e)
    });
})




// Update NEWS
app.get('/getSpecificNews/:id', function (req, res) {
    uid = req.params.id.toString();
    Users3.findById(uid).then(function (news) {
        res.send(news);
        console.log(news);
    }).catch(function (e) {
        res.send(e)
    });
});

app.put('/updateNews/:id', function (req, res) {
    uid = req.params.id.toString();
    console.log(uid);
    console.log(req.body);
    Users3.findByIdAndUpdate({ _id: uid }, req.body).then(function () {
        console.log("News updated successfully.");
        res.send();
    }).catch(function (e) {
        console.log(e);
    })


});

// DELETE NEWS
app.delete('/deleteNews/:id', function (req, res) {
    Users3.findByIdAndDelete(req.params.id).then(function () {
        res.status(201).json({
            message: "Booking data deleted"
        });
    }).catch(function () {

    })
})

// TSHIRT KIT ADD
var storage3 = multer.diskStorage({
    destination: "club_tshirt",
    filename: (req, file, callback) => {
        let ext = path.extname(file.originalname);
        callback(null, "Prakash" + Date.now() + ext);
    }
});

var imageFileFilter3 = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb("Only image files accepted!!"), false;
    }
    cb(null, true);
};

var upload3 = multer({
    storage: storage3,
    fileFilter: imageFileFilter3,
    limits: { fileSize: 1000000 }
});



app.get('/getUser', auth, function (req, res) {
    res.send(req.user);
    console.log(req.user);
})

app.put('/updateprofile', auth, function (req, res) {
    const uid = req.user._id;
    console.log(req.body);

    Users.findByIdAndUpdate(uid, req.body, { new: true })
        .then(function (user) {
            res.send(user);
        })
        .catch(function (e) {
            res.send(e);
        })
})




//logout
app.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});


app.get('/getUsers', function (req, res) {
    Users.find().then(function (users) {
        res.send(users);
        console.log(users);
    }).catch(function (e) {
        res.send(e)
    });
})



app.listen(100);