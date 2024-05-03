// TODO: use status value to update roles when required and remove directly editing user roles operations

const OrganisationCard = require('../models/OrganisationCard')
const User = require('../models/User')

const getAllOrgCards = async (req, res) => {
    const orgCards = await OrganisationCard.find().lean()

    if (!orgCards?.length) {
        return res.status(400).json({ message: 'No organisation cards found' })
    }

    const orgCardsWithUsers = await Promise.all(orgCards.map(async (orgCard) => {
        const user = await User.findById(orgCard.user).lean().exec()
        const issuerUser = await User.findById(orgCard.issuedBy).lean().exec()
        return { ...orgCard, username: user.username, issuerUsername: issuerUser.username }
    }))

    res.json(orgCardsWithUsers)
}

const createNewOrgCard = async (req, res) => {
    const { user, organisation, status, issuedBy } = req.body

    if (!user || !organisation || !status || !issuedBy) {
        return res.status(400).json({ message: 'Required fields are missing' })
    }

    const orgCardUser = await User.findById(user).exec()
    const orgCardIssuerUser = await User.findById(issuedBy).lean().exec()

    if (!orgCardUser || !orgCardIssuerUser) {
        return res.status(400).json({ message: 'No such users found' })
    }

    if (orgCardUser.hasOrgCard) {
        return res.status(400).json({ message: 'User already has an organisation card' })
    }

    const newOrgCard = { user, organisation, status, issuedBy }
    const orgCard = await OrganisationCard.create(newOrgCard)

    if (orgCard) {
        orgCardUser.roles = [status]
        orgCardUser.hasOrgCard = true
        await orgCardUser.save()

        res.status(201).json({ message: `New ${status} card issued to ${user} (new roles: ${orgCardUser.roles.toString()}) by ${issuedBy}` })
    } else {
        res.status(400).json({ message: 'Invaild organisation card data' })
    }
}

const updateOrgCard = async (req, res) => {
    const { id, status, issuedBy, active } = req.body

    if (!id || !status || !issuedBy || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'Required fields are missing' })
    }

    const orgCard = await OrganisationCard.findById(id).exec()

    if (!orgCard) {
        return res.status(400).json({ message: 'Organisation card not found' })
    }

    const duplicateOrgCard = await OrganisationCard.findOne({ status, issuedBy, active }).lean().exec()

    if (duplicateOrgCard && duplicateOrgCard?._id.toString() === id) {
        return res.status(409).json({ message: 'Organisation card is not edited' })
    }

    orgCard.status = status
    orgCard.issuedBy = issuedBy
    orgCard.active = active
    orgCard.edited = true

    await orgCard.save()

    const orgCardUser = await User.findById(orgCard.user).exec()
    orgCardUser.roles = [status]

    await orgCardUser.save()

    res.json({ message: `Organisation card ${id} updated by ${issuedBy}` })
}

const deleteOrgCard = async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'Organisation card ID required' })
    }

    const orgCard = await OrganisationCard.findById(id).exec()

    if (!orgCard) {
        return res.status(400).json({ message: 'Organisation card not found' })
    }

    const orgCardUser = await User.findById(orgCard.user).exec()
    orgCardUser.roles = ['User']
    orgCardUser.hasOrgCard = false

    await orgCardUser.save()

    await orgCard.deleteOne()

    res.json({ message: 'Organisation card removed' })
}

module.exports = {
    getAllOrgCards,
    createNewOrgCard,
    updateOrgCard,
    deleteOrgCard
}