const bcrypt = require('bcrypt') // To hash passwords

const User = require('../models/User')
const Post = require('../models/Post')

// @desc Get all Users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
    // Find all users (no need for save(), hence using lean() to get JSON data)
    const users = await User.find().select('-password').lean() // Don't display passwords

    // If users are not found
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' }) // Using return to end the function
    }
    // If users are found
    res.json(users)
}

// @desc Create New User
// @route POST /users
// @access Private
const createNewUser = async (req, res) => {
    // Destructure request body
    const { name, username, email, password, roles } = req.body

    // Confirm Data
    if (!name || !username || !email || !password) {
        return res.status(400).json({ message: 'Required fields are missing' })
    }

    // Check Duplicates
    const duplicateUsername = await User.findOne({ username }).lean().exec()
    const duplicateEmail = await User.findOne({ email }).lean().exec()

    if (duplicateUsername) { // If duplicate username is found
        return res.status(409).json({ message: 'Duplicate username' })
    } else if (duplicateEmail) { // If duplicate email is found
        return res.status(409).json({ message: 'Duplicate email' })
    }

    // Hash password (after no duplicates are found)
    const hashedPassword = await bcrypt.hash(password, 10) // Using 10 salt rounds

    // Create & Store New User Object
    const newUser = (!Array.isArray(roles) || !roles.length)
        ? { name, username, email, 'password': hashedPassword }
        : { name, username, email, 'password': hashedPassword, roles }

    const user = await User.create(newUser)

    if (user) { // New User Object is created
        res.status(201).json({ message: `New user ${username} created` })
    } else { // Failed to create New User Object
        res.status(400).json({ message: 'Invaild user data' })
    }
}

// @desc Update a User
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
    // Destructure request body
    const { id, name, username, email, password, roles, active } = req.body

    // Confirm Data (don't need to check for password everytime)
    if (!id || !name || !username || !email || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'Required fields are missing' })
    }

    // Find User
    const user = await User.findById(id).exec() // Not using lean() due to use of save() method later

    if (!user) { // No User found
        return res.status(400).json({ message: 'User not found' })
    }

    // Check Duplicates while allowing updates to the original User
    const duplicateUsername = await User.findOne({ username }).lean().exec()
    const duplicateEmail = await User.findOne({ email }).lean().exec()

    if (duplicateUsername && duplicateUsername?._id.toString() !== id) { // If duplicate username is found and users are different (i.e., not the original user)
        return res.status(409).json({ message: 'Duplicate username' })
    } else if (duplicateEmail && duplicateEmail?._id.toString() !== id) { // If duplicate email is found and users are different
        return res.status(409).json({ message: 'Duplicate email' })
    }

    // Update original User with request body data (after no duplicates are found)
    user.name = name
    user.username = username
    user.email = email
    user.roles = roles
    user.active = active

    // If password is being updated
    if (password) {
        // Hash password
        user.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await user.save()

    res.json({ message: `User ${updatedUser.username} updated` })
}

// @desc Delete a User
// @route DELETE /users
// @access Private
const deleteUser = async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'User ID required' })
    }

    // Check if user has content published
    // TODO: remove all other content types and details before removing the user 
    const post = await Post.findOne({ user: id }).lean().exec()

    if (post) {
        return res.status(400).json({ message: 'User has posts' })
    }

    const user = await User.findById(id).exec()

    if (!user) { // User not found
        return res.status(400).json({ message: 'User not found' })
    }

    // Delete if user is found
    // TODO: get deleted user object
    await user.deleteOne()

    res.json({ message: 'User deleted' })
}

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}