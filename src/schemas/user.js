const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;
const JWT_SECRET = 'assdd3d21erfadffefgaeeva';

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
        validate: (value) => {
            if (value.toLowerCase().includes('password')) {
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
    age: {
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

userSchema.pre('save', async function (next) {
    const user = this;
    
    if (user.isDirectModified('password')) {
        try {
            user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
        } catch (error) {
            throw new Error('Something went wrong.');
        }
    }

    next();
});

userSchema.statics.findByCredentials = async (email, password) => {

    const user = await User.findOne({ email });
    console.log(password)
    if (!user) {
        throw new Error('User not found.');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login.');
    }

    return user;
}

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET);

    user.tokens = user.tokens.concat({ token });

    await user.save();

    return token;
}

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

const User = mongoose.model('User', userSchema);

module.exports = User;
