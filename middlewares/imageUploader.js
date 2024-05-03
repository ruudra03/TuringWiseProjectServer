const util = require('util')
const multer = require('multer')
const { v4: uuid } = require('uuid')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'public', 'uploads'))
    },
    filename: (req, file, cb) => {
        cb(null, uuid() + '_' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png']

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Invaild file type'))
    }
}

const maxFileSize = 10 * 1024 * 1024 // equals to 10MB

const upload = multer({ storage: storage, fileFilter, limits: { fileSize: maxFileSize } }).single('file')

const imageUploader = util.promisify(upload)

module.exports = imageUploader