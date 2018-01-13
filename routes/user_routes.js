const express = require('express');
const router = express.Router();
const User = require('../models/user');
const config= require("../config/config");
const JWT = require('jsonwebtoken');
const passport=require("passport");
const passportConf=require('../config/passport');


router.post('/user/signup', function (req, res, next) {

    const newUser = new User({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        email : req.body.email,
        phone: req.body.phone,
        regiester_date: req.body.regiester_date
    });

    User.saveUser(newUser, function (err, user) {
        if (err) 
        {
           res.send({
                "status":"false"
            });
            return console.error(err);
        }
        const token= JWT.sign({
            userId: user._id,
            userName:user.username
        }, config.secret);
        res.send({
            "status":"true", 
            "value":user._id,
            "token":"JWT "+token
        });
      });
});

router.get("/user/profile",passport.authenticate('jwt',{session:false}),(req,res)=>{
    res.json({message:"This is profile"});
});

router.post("/user/login",(req,res)=>{
    User.getUserByName(req.body.username,(err,user)=>{
        if(err) throw err;
        User.comparePassword(req.body.password,user.password,(err,isMatch)=>{
            if(isMatch){
                const token= JWT.sign({
                    userId: user._id,
                    userName:user.username
                }, config.secret);
                res.send({
                    "status":"true", 
                    "value":user._id,
                    "token":"JWT "+token
                });
            }else{
                res.send({
                    "status":"false", 
                    "message":"Login failed"
                });
            }
        });
    });
});

module.exports = router;
