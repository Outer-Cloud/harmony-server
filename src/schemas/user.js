const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const SALT_ROUNDS = 10
const JWT_SECRET = 'assdd3d21erfadffefgaeeva'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate: function(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain \'password\'')
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowerCase: true
    },
    age:{
        type: Number,
        required: true,
        min: [7, 'Too young']
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.pre('save', function(next) {
    const user = this

    if(user.isDirectModified('password')){
        return bcrypt.hash(user.password, SALT_ROUNDS)
        .then(function(res){
            user.password = res
        })
        .catch(function(err){
            throw new Error('Something went wrong.')
        })
    }

    return Promise.resolve()
})

userSchema.statics.findByCredentials = function(email, password){

    return User.findOne({email})
    .then(function(user){
        if(!user){
            throw new Error('User not found.')
        }

        return Promise.all([user, bcrypt.compare(password, user.password)])
    })
    .then(function([user, isMatch]){

        if(!isMatch){
            throw new Error('Unable to login.')
        }
        return Promise.resolve(user) 
    })
    .catch(function(err){
        throw new Error('Something went wrong')
    })
}

userSchema.methods.generateAuthToken = function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, JWT_SECRET)

    user.tokens = user.tokens.concat({token})

    return user.save().then(function(res){
        return Promise.resolve(token)
    })
}

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

const User = mongoose.model('User', userSchema)

module.exports = User
