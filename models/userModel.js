const mongoose = require('mongoose');

const userSchema =  mongoose.Schema(
    {
        name:{
            type: String,
            required : true,
        },
        email :{
            type: String,
            required : true,
        },
        mobile :{
            type: String,
            required : true,
        },
        password:{
            type : String,
            required : true,
        },
        status:{
            type : String,
            required : false
        },
    },{
        timestamps : true
    }
)


const User = mongoose.model('User', userSchema);

module.exports = User;