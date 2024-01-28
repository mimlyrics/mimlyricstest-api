const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const EMAIL_RGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const PASSWORD_REGEX = /^[A-Za-z]\w{7,14}$/
const NAME_REGEX = /^[a-zA-Z0-9]+$/
const PHONE_REGEX= /\d{9}/

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: [true, "firstName is required"],
        /*validate: {
            validator: function (v) {
                return NAME_REGEX.test(v);
            },
            message: props => `${props.value} must start with a letter. Letters, numbers No(~!@#$%^&*(_+){} \"'.,:;/?`
        }*/
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, "Last name must be required"],
        /*validate: {
            validator: function (v) {
                return NAME_REGEX.test(v);
            },
            message: props => `${props.value}  must start with a letter. Letters, numbers No(~!@#$%^&*(_+){} \"'.,:;/?`
        }*/
    },
    email: {
        type: String,
        trim: true,
        required: [true, "email must be required"],
        /*validate: {
            validator: function(v) {
                return EMAIL_RGEX.test(v);
            },
            message: props => `${props.value} is not valid`
        }*/
    },
    phone: {
        type: String,
        required: [true, "Phone number must be required"],
        /*minLength: 7,
        maxLength: 13*/
    },
    password: {
        type: String,
        required: [true, "password must be required"],
        /*validate: {
            validator: function(v) {
                return PASSWORD_REGEX.test(v);
            },
            message: props => `${props.value} must contain atleast a letter, number and should not be less than 8 characters `
        }*/
    },
    role: {
        isAdmin: {type: Boolean, default: () => false},
        isEditor: {type: Boolean, default: () => false},
    },
    avatar: {
        type: String,
        default: () => ""
    },
    refreshToken: {
        type: String,
    },
    theme: {
        color: {
            type: String,
            default: () => 'system'
        },
        bg: {
            type: String,
            default: () => 'system'
        },   
    },
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model('User', userSchema);
module.exports = User;