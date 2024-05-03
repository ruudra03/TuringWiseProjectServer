const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const researchSchema = new mongoose.Schema(
    {
        users: {
            type: [mongoose.Schema.Types.ObjectId],
            required: true,
            ref: 'User'
        },
        title: {
            type: String,
            required: true
        },
        docHeaders: {
            type: [String]
        },
        docParagraphs: {
            type: [String]
        },
        docFormatFlow: {
            type: [String],
            required: true
        },
        figures: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Image'
        },
        tags: {
            type: [String],
            default: ['Research']
        },
        category: {
            type: String,
            required: true
        },
        comments: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Comment',
            default: []
        },
        likes: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
)

researchSchema.plugin(AutoIncrement, {
    inc_field: 'research',
    id: 'researchNums',
    start_seq: 1
})

module.exports = mongoose.model('Research', researchSchema)