const mongoose = require ('mongoose')

const groupschema = new mongoose.Schema({
    name: {
        type:String,
        required: true 
    },
    description: String,
    createdBy : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User',
        required : true 
    },
    members : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }],
    invitedMembers: [
  {
    name: String,
    email: String,
    invitedAt: { type: Date, default: Date.now }
  }
]

}, { timestamps: true}); //this adds the fields like createdAt and updatedAt

const Group = mongoose.model('Group',groupschema)
module.exports = Group;