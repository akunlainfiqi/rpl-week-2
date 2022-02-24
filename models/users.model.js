const mongoose = require('mongoose');

var validateEmail = (value) => {
    const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
    return re.test(value)
}

const UsersSchema = new mongoose.Schema({
    email : {
        type: String,
        required : 'Email is required',
        unique : true,
        lowercase: true,
        validate: [validateEmail, 'please fill a valid email address'],
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, "please fill a valid email address"]
    },
    name : {
        type : String,
        required : true,
        unique : true,
    },
})

const User = mongoose.model('User', UsersSchema)

module.exports = User;