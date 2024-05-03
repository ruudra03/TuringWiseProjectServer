const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const articleSchema = new mongoose.Schema(
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
        brief: {
            type: String,
            required: true
        },
        image: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Image'
        },
        docHeaders: {
            type: [String]
        },
        docParagraphs: {
            type: [String]
        },
        docImages: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Image'
        },
        docNotes: {
            type: [String],
        },
        docFormatFlow: {
            type: [String],
            required: true
        },
        tags: {
            type: [String],
            default: ['Article']
        },
        category: {
            type: String,
            required: true
        },
        comments: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Comment'
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

articleSchema.plugin(AutoIncrement, {
    inc_field: 'article',
    id: 'articleNums',
    start_seq: 1
})

module.exports = mongoose.model('Article', articleSchema)