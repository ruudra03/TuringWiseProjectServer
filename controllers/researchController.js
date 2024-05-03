// TODO: check for ?.length (i.e., optional chaining) everywhere needed
// TODO: use select() to pick up only required fields everywhere needed inside get all contents (i.e., researches and articles) => like in line 14 here
const Research = require("../models/Research")
const User = require("../models/User")

const getAllResearches = async (req, res) => {
    const researches = await Research.find().lean()

    if (!researches?.length) {
        return res.status(400).json({ message: 'No researches found' })
    }

    const researchesWithUsers = await Promise.all(researches.map(async (research) => {
        const users = await User.find({ _id: { $in: research.users } }).select('username').lean().exec()
        return { ...research, usernames: users }
    }))

    res.json(researchesWithUsers)
}

const createNewResearch = async (req, res) => {
    const { users, title, docHeaders, docParagraphs, docFormatFlow, figures, tags, category } = req.body

    if (!users || !title || !Array.isArray(docFormatFlow) || !docFormatFlow.length || !category) {
        return res.status(400).json({ message: 'Required fields are missing' })
    }

    let result = { users, title }

    if (Array.isArray(docHeaders) && docHeaders?.length) {
        result = { ...result, docHeaders }
    }

    if (Array.isArray(docParagraphs) && docParagraphs?.length) {
        result = { ...result, docParagraphs }
    }

    result = { ...result, docFormatFlow }

    if (Array.isArray(figures) && figures?.length) {
        result = { ...result, figures }
    }

    if (Array.isArray(tags) && tags?.length) {
        result = { ...result, tags }
    }

    result = { ...result, category }

    const newResearch = result

    const research = await Research.create(newResearch)

    if (research) {
        res.status(201).json({ message: `New research by ${users} added` })
    } else {
        res.status(400).json({ message: 'Invaild research data' })
    }
}

const updateResearch = async (req, res) => {
    const { id, likes } = req.body

    if (!id) {
        return res.status(400).json({ message: 'Required fields are missing' })
    }

    const research = await Research.findById(id).exec()

    if (!research) {
        return res.status(400).json({ message: 'Research not found' })
    }

    if (research.likes === likes) {
        return res.status(409).json({ message: 'Research is not updated' })
    }

    research.likes = likes

    await research.save()

    res.json({ message: `Research ${id} updated` })
}

const deleteResearch = async (req, res) => {
    const { id } = req.body

    const research = await Research.findById(id).exec()

    if (!research) {
        return res.status(400).json({ message: 'Research not found' })
    }

    await research.deleteOne()

    res.json({ message: 'Research deleted' })
}

module.exports = {
    getAllResearches,
    createNewResearch,
    updateResearch,
    deleteResearch
}