const path = require('path');
const multer = require('multer');
const uuid = require('uuid');

const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, '../server/public/uploads');
    },
    filename: (req, file, callback) => {
        const uniqueId = uuid.v4();
        callback(null, `${file.fieldname}${uniqueId}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, callback) => {
    if(file.mimetype.startsWith('image/')) {
        callback(null, true);
    } else {
        callback(null, false);
    }
}

const uploadSingleFile = multer({
    storage: fileStorage, 
    limits: { fileSize: '10mb' }, 
    fileFilter: fileFilter}).single('file');

const uploadFiles = multer({
    storage: fileStorage,
    limits: { fileSize: '10mb' },
    fileFilter: fileFilter,
}).fields([
    { name: "mainImage", maxCount: 1 }, { name: "subImage1", maxCount: 1 },{ name: "subImage2", maxCount: 1 }, 
    { name: "subImage3", maxCount: 1 }, { name: "subImage4", maxCount: 1 }, { name: "subImage5", maxCount: 1 }, 
    { name: "subImage6", maxCount: 1 }, 
]);

module.exports = {
    fileStorage,
    fileFilter,
    uploadFiles,
    uploadSingleFile
};