var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var jwt = require('jwt-simple')
var bcrypt   = require('bcrypt-nodejs')

var User = require('./models/User.js')
var Post = require('./models/Post.js')
var auth = require('./auth.js')


var app = express()

app.use(cors());
app.use(bodyParser.json())

app.get('/posts/:id', async (req, res) => {
    var author = req.params.id;
    var posts = await Post.find({author})
    res.send(posts);

});


app.post('/post', auth.checkAuthenticated, (req, res) => {

    console.log('user posted ' + req.userId)
    var postData = req.body
    postData.author = req.userId

   var post = new Post(postData);

   post.save((err, result ) => {
    if (err) {
    console.error('saving post error'  + err)
    res.sendStatus(500).send({message: 'Error saving post try again'})
    }
    
    res.sendStatus(200)
})

});

app.get('/users',  async (req, res) => {
    try {
        var users = await User.find({}, '-password -__v');
        res.send(users);
    }
    catch(error) {
        console.error(error);
        res.sendStatus(500);
    }
 
});

app.get('/profile/:id',async (req, res) => {
    console.log(req.params.id);
    try {
        var user = await User.findById(req.params.id, '-password -__v');
        res.send(user);
    }
    catch(error) {
        console.error(error);
        res.sendStatus(500);
    }
   // res.sendStatus(200)
});

// app.post('/register', auth.register)

// app.post('/login', auth.login)

app.use('/auth', auth.router)

app.listen(3001)

mongoose.connect('mongodb://sysadmin:********@ds113098.mlab.com:13098/pssocial', (err) => {
    if (!err) {
        console.log('connected to mongo');
    }
    else {
        console.log('connected to mongo ERRR' + err);   
     }
});
