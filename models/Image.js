// TODO: implement image uploading feature
const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

var imageSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        name: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

imageSchema.plugin(AutoIncrement, {
    inc_field: 'image',
    id: 'imageNums',
    start_seq: 1
})

module.exports = mongoose.model('Image', imageSchema)