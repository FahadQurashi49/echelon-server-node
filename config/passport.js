const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const config= require("./config");
const User = require("../models/user");
const passport=require("passport");

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromHeader('authorization'),
    secretOrKey: config.secret
  },  (payload, done) => {
    try {

      User.getUserById(payload.userId,(err,user)=>{
        if(err)
        {
            //throw Error;
            console.log(err);
            return done(err,false)
        }
        if(user)
        {
          console.log(user);
          return done(null,user); 
        }
        else
        {
            console.log(err);
            return done(null,false);
        }
    })
   
    } catch(err) {
      done(err, false)
    }
  }))