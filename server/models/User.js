const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcryptjs')


const userschema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'Please enter mail'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'enter valid mail']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'minlength 6']
    },
    groups: [{
        type:mongoose.Schema.Types.ObjectId ,
        ref:'Group'
    }]
})

//fire func before user save to db
userschema.pre('save',async function (next) { //after a save then we have to fire a function
    // console.log('user about to be created & saved',this)
    const salt = await bcrypt.genSalt()
    this.password=await bcrypt.hash(this.password,salt)
    next()  
})

//static method to login user
userschema.statics.login = async function(email,password){
    const user = await this.findOne({email})
    if(user){
        const ismatch =await bcrypt.compare(password,user.password)
        if(ismatch){
            return user
        }
        throw Error('incorrect password')
    }
    throw Error("incorrect email");
    
}
module.exports = mongoose.model('User', userschema)