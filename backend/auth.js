var bcrypt   = require('bcrypt-nodejs')
var User = require('./models/User.js')
var jwt = require('jwt-simple')
var express = require('express')
var router = express.Router();

router.post('/register', function (req, res) {
    // console.log(req.body);
    var userData = req.body;
    console.log(userData.email);
    var user = new User(userData)
 
    user.save((err, newUser ) => {
          if (err) {
          console.log('saving user error'  + err)
          res.sendStatus(500).send({message: 'Error saving user try again'})
          }
          
          var payload = {
            sub: newUser._id
        }
        var token = jwt.encode(payload, '123');
        return res.status(200).send({token});
    })
 });

 router.post('/login', async function (req, res){
    var loginData = req.body
    var user = await User.findOne({email: loginData.email})
    if (!user)
        return res.status(401).send({message: 'Email or Password invalid'})

        bcrypt.compare(loginData.password, user.password, (err, isMatch) => {
            if (!isMatch)
            return res.status(401).send({message: 'Email or Password invalid'})
            var payload = {
                sub: user._id
            }
            var token = jwt.encode(payload, '123');
            return res.status(200).send({token});
        })

}
);

var auth = {
    router, 
    checkAuthenticated: (req, res, next) => {
        if (!req.header('authorization'))
                       return res.status(401).send({message: 'Unauthorized. Missing Auth Header'})
                       console.log('payloadchecked' + req.header('authorization'))
                       var token = req.header('authorization').split(' ')[1];
          
            var payload = jwt.decode(token, '123')
  
            if (!payload) {
                return res.status(401).send({message: 'Unauthorized. Auth Header Invalid'})
            }
     
            req.userId = payload.sub
            next()     
    }
}





module.exports = auth

