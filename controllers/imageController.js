const imageUploader = require('../middlewares/imageUploader')
const Image = require('../models/Image')

const createNewImage = async (req, res) => {
    const user = req.query.id
    let name

    try {
        await imageUploader(req, res)
        name = req.file.originalname

    } catch (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(500).json({ message: 'Failed to upload the image (file size exceeded)' })
        }

        console.log(err)
        return res.status(400).json({ message: 'Failed to upload the image' })
    }

    const image = await Image.create({ user, name })
    res.status(201).json(image._id)
}

module.exports = {
    createNewImage
}