const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const orgCardSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        organisation: {
            type: String,
            required: true
        },
        status: { // One of two possible values only (i.e., 'Organisation User' or 'Organisation Admin')
            type: String,
            required: true
        },
        issuedBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        edited: {
            type: Boolean,
            default: false
        },
        active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
)

orgCardSchema.plugin(AutoIncrement, {
    inc_field: 'organisationCard',
    id: 'orgCardNums',
    start_seq: 0
})

module.exports = mongoose.model('OrganisationCard', orgCardSchema)