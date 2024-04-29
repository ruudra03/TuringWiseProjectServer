const User = require('../models/User')
const Post = require('../models/Post')

// @desc Get all Posts
// @route GET /posts
// @access Private
const getAllPosts = async (req, res) => {
    const posts = await Post.find().lean()

    if (!posts?.length) {
        return res.status(400).json({ message: 'No posts found' })
    }

    const postsWithUser = await Promise.all(posts.map(async (post) => {
        const user = await User.findById(post.user).lean().exec()
        return { ...post, username: user.username }
    }))

    res.json(postsWithUser)
}

// @desc Create New Post
// @route POST /users
// @access Private
const createNewPost = async (req, res) => {
    const { user, title, body, tags } = req.body

    if (!user || !title || !body || !Array.isArray(tags) || !tags.length) {
        return res.status(400).json({ message: 'Required fields are missing' })
    }

    const postUser = await User.findById(user).lean().exec()

    if (!postUser) {
        return res.status(400).json({ message: 'No such user found' })
    }

    const newPost = { user, title, body, tags }
    const post = await Post.create(newPost)

    if (post) { // New Post Object is created
        res.status(201).json({ message: `New post added by ${user}` })
    } else { // Failed to create New Post Object
        res.status(400).json({ message: 'Invaild post data' })
    }
}

// @desc Update a Post
// @route PATCH /users
// @access Private
const updatePost = async (req, res) => {
    const { id, title, body, tags } = req.body

    if (!id || !title || !body || !Array.isArray(tags) || !tags.length) {
        return res.status(400).json({ message: 'Required fields are missing' })
    }

    const post = await Post.findById(id).exec()

    if (!post) {
        return res.status(400).json({ message: 'Post not found' })
    }

    // Check for changes
    const duplicatePost = await Post.findOne({ title, body, tags }).lean().exec()

    if (duplicatePost && duplicatePost?._id.toString() === id) { // No changes are made
        return res.status(409).json({ message: 'Post is not edited' })
    }

    post.title = title
    post.body = body
    post.tags = tags
    post.edited = true

    await post.save()

    res.json({ message: `Post ${id} updated` })
}

// @desc Delete a Post
// @route DELETE /users
// @access Private
const deletePost = async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'Post ID required' })
    }

    const post = await Post.findById(id).exec()

    if (!post) { // Post not found
        return res.status(400).json({ message: 'Post not found' })
    }

    await post.deleteOne()

    res.json({ message: 'Post deleted' })
}

module.exports = {
    getAllPosts,
    createNewPost,
    updatePost,
    deletePost
}