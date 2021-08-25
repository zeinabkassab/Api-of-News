const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const reporterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 20,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be positive number')
            }
        }
    },
    phoneNumber: {
        type: Number,
        minLength: 11,
        validate(value) {
            if (value < 11) {
                throw new Error('phoneNumber must be 11 number')
            }
        }
    },
    email: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 6
    },

    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],

    avatar: {
        type: Buffer
    }
})


// === === === === === === === === === Relation === === === === === === === ===

reporterSchema.virtual('reporterNews', {
    ref: 'News',
    localField: '_id',
    foreignField: 'owner'
})



// === === === === === === === === === Hash password === === === === === === === ===



reporterSchema.pre('save', async function(next) {
    // this document 
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})


reporterSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email })
    console.log(user)

    if (!user) {
        throw new Error('Unable to login. Please check email or password')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login. Please check email or password')
    }

    return user
}


// === === === === === === === === ===  Create token === === === === === === === ===


reporterSchema.methods.generateToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'News-api', { expiresIn: '7 days' })

    user.tokens = user.tokens.concat({ token: token })
    await user.save()

    return token
}




const Reporter = mongoose.model('Reporter', reporterSchema)
module.exports = Reporter