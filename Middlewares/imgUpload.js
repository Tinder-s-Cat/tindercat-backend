const multer = require('multer')
const path = require('path');

//set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename : function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

//init upload
const upload = multer({
    storage : storage,
    limits : { fileSize: 1000000},
    fileFilter : function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('catImage')

function checkFileType(file, cb) {
    //allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error : Image Only!');
    }
}

module.exports = { upload }