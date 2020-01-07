const multer = require('multer');

const uploadProductImage = multer({
        limits: {
            fileSize: 10000000
        },
        // @To Do!!!!!!!!!!!!!!!!!
        // fileFilter( req, file, cb) {
        //     if (!file.type.match(/\.(png|PNG|jpeg|JPEG|jpg|JPG)$/)) {
        //         return cb(new Error('Please upload a PNG, JPEG or jpg file.'))
        //     }
        //     cb(undefined, true);
        // }
}).single('productImage');

module.exports = uploadProductImage;