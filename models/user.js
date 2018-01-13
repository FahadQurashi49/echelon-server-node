const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs")

const UserSchema = mongoose.Schema({
    username:{type: String ,require:true},
    password:{type: String, require:true },
    email:{type: String, require:true},
    phone:{type: String, require:false},
    name:{type: String, require:false},
    regiester_date:{type: String}
});

const User= module.exports=mongoose.model("User",UserSchema);

module.exports.saveUser= function(newUser, callback){
    bcrypt.genSalt(10,(err,salt)=>{
        if(err){
            throw err;           
        }

        bcrypt.hash(newUser.password,salt,(err,hash)=>{
                if(err){
                    throw err;           
                }
                newUser.password=hash;
                newUser.save(callback);
            })
    })
    
}

module.exports.getUserById= function (id,callback){
    const qurey = {_id: id};
    User.findOne(qurey,callback);
}

module.exports.getUserByName= function (userName,callback){
    const qurey = {username: userName};
    User.findOne(qurey,callback);
}

module.exports.comparePassword= (password,hash,callback)=>{

    bcrypt.compare(password,hash,function(err,isMatch){
        if(err) throw err;
        callback(null,isMatch);
    });

}