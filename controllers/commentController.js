const Article = require('../models/Article')
const Comment = require('../models/Comment')
const User = require('../models/User')

// TODO: add logic for research content comments (similar to article)
// TODO: use update article controller inside create new comment to add newly added comments
// TODO: might have forgotton to check if user or other ids exsists before creating new data in some controllers
const getAllContentComments = async (req, res) => {
    const { commentedOn } = req.body

    const contentComments = await Comment.find({ commentedOn: commentedOn }).lean()

    if (!contentComments) {
        return res.status(400).json({ message: 'No comments yet' })
    }

    const contentCommentsWithUsers = await Promise.all(contentComments.map(async (contentComment) => {
        const user = await User.findById(user).lean().exec()
        return { ...contentComment, username: user.username }
    }))

    res.json(contentCommentsWithUsers)
}

const createNewContentComment = async (req, res) => {
    const { user, commentedOn, body } = req.body

    if (!user || !commentedOn || !body) {
        return res.status(400).json({ message: 'Required fields are missing' })
    }

    // Check if user & content exsists
    // TODO: also add logic to check for other content types (i.e., research content)
    const commentUser = await User.findById(id).lean().exec()
    const commentedOnArticle = await Article.findById(commentedOn).exec()

    if (!commentUser) {
        return res.status(400).json({ message: 'No such user found' })
    }

    if (!commentedOnArticle) {
        return res.status(400).json({ message: 'No such content found' })
    }

    const newComment = { user, commentedOn, body }
    const comment = await Comment.create(newComment)

    if (comment) {
        if (commentedOnArticle) {
            const articleComments = commentedOnArticle.comments
            const result = [...articleComments, comment._id]

            commentedOnArticle.comments = result

            await commentedOnArticle.save()
        }
        res.status(201).json({ message: `New comment added by ${user} on ${commentedOn}` })
    } else {
        res.status(400).json({ message: 'Invaild comment data' })
    }
}

const updateContentComment = async (req, res) => {
    const { id, body, likes } = req.body

    if (!id || !body) {
        return res.status(400).json({ message: 'Required fields are missing' })
    }

    const comment = await Comment.findById(id).exec()

    if (!comment) {
        return res.status(400).json({ message: 'Comment not found' })
    }

    const duplicateComment = await Comment.findOne({ body, likes })

    if (duplicateComment && duplicateComment?._id === id) {
        return res.status(409).json({ message: 'Comment is not updated' })
    }

    comment.body = body
    comment.likes = likes
    comment.edited = true

    await comment.save()

    res.json({ message: `Comment ${id} updated` })
}

const deleteContentComment = async (req, res) => {
    const { id } = req.body

    const comment = await Comment.findById(id).exec()

    if (!comment) {
        return res.status(400).json({ message: 'Comment not found' })
    }

    await comment.deleteOne()

    res.json({ message: 'Comment deleted' })
}

module.exports = {
    getAllContentComments,
    createNewContentComment,
    updateContentComment,
    deleteContentComment
}