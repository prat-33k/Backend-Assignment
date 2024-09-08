const path= require('path');
const multer = require('multer');
const targetDir = './src/uploads/csv/';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, targetDir)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
  })
const upload = multer({storage: storage})
module.exports = upload;
