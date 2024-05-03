const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const commentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        commentedOn: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        likes: {
            type: Number,
            default: 0
        },
        edited: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

commentSchema.plugin(AutoIncrement, {
    inc_field: 'comment',
    id: 'commentNums',
    start_seq: 1
})

module.exports = mongoose.model('Comment', commentSchema)