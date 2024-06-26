const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        title: {
            type: String,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        tags: {
            type: [String],
            default: ['Post']
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

postSchema.plugin(AutoIncrement, {
    inc_field: 'post',
    id: 'postNums',
    start_seq: 1
})

module.exports = mongoose.model('Post', postSchema)