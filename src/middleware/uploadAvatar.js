const multer = require('multer');

const uploadAvatar = multer({
        limits: {
            fileSize: 3000000
        },
        fileFilter( req, file, cb) {
            console.log(file);
            if (!file) {
                return cb(new Error('Please upload a PNG, JPEG or jpg file.'));
            }
            if (!file.originalname.match(/\.(png|PNG|jpeg|JPEG|jpg|JPG)$/)) {
                return cb(new Error('Please upload a PNG, JPEG or jpg file.'))
            }
            cb(undefined, true);
        }
}).single('avatar');

module.exports = uploadAvatar;