const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: [String],
        default: ['User']
    },
    hasOrgCard: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    }
})

userSchema.plugin(AutoIncrement, {
    inc_field: 'user',
    id: 'userNums',
    start_seq: 0
})

module.exports = mongoose.model('User', userSchema)