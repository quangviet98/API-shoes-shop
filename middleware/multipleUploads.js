const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) { // nơi lưu trữ file upload
        cb(null, `${__dirname}/../uploads`);
    },
    filename: function (req, file, cb) { // tên file được lưu
        console.log(file);
        cb(null, Date.now() + file.originalname);
    }
})
const filter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') { //chỉ chấp nhận file ảnh có đuôi png hoặc jpeg
        cb(null, true);
    } else {
        cb(null, false);
    }
}

module.exports = multer({
    storage: storage,
    fileFilter: filter
})