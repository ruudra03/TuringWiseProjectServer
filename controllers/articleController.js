// TODO: use p-limit anywhere necessary to limit promises
// const plimit = require('p-limit')
// const limit = plimit(10)

const Article = require('../models/Article')
const User = require('../models/User')

const getAllArticles = async (req, res) => {
    const articles = await Article.find().lean()

    if (!articles?.length) {
        return res.status(400).json({ message: 'No articles found' })
    }

    const articlesWithUser = await Promise.all(articles.map(async (article) => {
        const user = await User.findById(article.user).lean().exec()
        return { ...article, username: user.username }
    }))

    res.json(articlesWithUser)
}

const createNewArticle = async (req, res) => {
    const { user, title, brief, image, docHeaders, docParagraphs, docImages, docNotes, docFormatFlow, tags, category } = req.body

    if (!user || !title || !brief || !image || !Array.isArray(docFormatFlow) || !docFormatFlow.length || !category) {
        return res.status(400).json({ message: 'Required fields are missing' })
    }

    let result = { user, title, brief, image }

    if (Array.isArray(docHeaders) && docHeaders?.length) {
        result = { ...result, docHeaders }
    }

    if (Array.isArray(docParagraphs) && docParagraphs?.length) {
        result = { ...result, docParagraphs }
    }

    if (Array.isArray(docImages) && docImages?.length) {
        result = { ...result, docImages }
    }

    if (Array.isArray(docNotes) && docNotes?.length) {
        result = { ...result, docNotes }
    }

    result = { ...result, docFormatFlow }

    if (Array.isArray(tags) && tags?.length) {
        result = { ...result, tags }
    }

    result = { ...result, category }

    const newArticle = result

    const article = await Article.create(newArticle)

    if (article) {
        res.status(201).json({ message: `New article added by ${user}` })
    } else {
        res.status(400).json({ message: 'Invaild article data' })
    }
}

const updateArticle = async (req, res) => {
    const { id, title, brief, image, docHeaders, docParagraphs, docImages, docNotes, docFormatFlow, tags, category, comments, likes } = req.body

    if (!id || !title || !brief || !image || !Array.isArray(docFormatFlow) || !docFormatFlow.length || !category) {
        return res.status(400).json({ message: 'Required fields are missing' })
    }

    const article = await Article.findById(id).exec()

    if (!article) {
        return res.status(400).json({ message: 'Article not found' })
    }

    const duplicateArticle = await Article.findOne({ title, brief, image, docHeaders, docParagraphs, docImages, docNotes, docFormatFlow, tags, category, comments, likes }).lean().exec()

    if (duplicateArticle && duplicateArticle?._id.toString() === id) {
        return res.status(409).json({ message: 'Article is not updated' })
    }

    article.title = title
    article.brief = brief
    article.image = image
    article.docHeaders = docHeaders
    article.docParagraphs = docParagraphs
    article.docImages = docImages
    article.docNotes = docNotes
    article.docFormatFlow = docFormatFlow
    article.tags = tags
    article.category = category
    article.comments = comments
    article.likes = likes
    article.edited = true

    await article.save()

    res.json({ message: `Article ${id} updated` })
}

const deleteArticle = async (req, res) => {
    const { id } = req.body

    const article = await Article.findById(id).exec()

    if (!article) {
        return res.status(400).json({ message: 'Article not found' })
    }

    await article.deleteOne()

    res.json({ message: 'Article deleted' })
}

module.exports = {
    getAllArticles,
    createNewArticle,
    updateArticle,
    deleteArticle
}