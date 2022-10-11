const multer = require("multer");

const fileFilter = (req, file, cb) =>{
    if( file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' )
    {
        cb( null , true);
    }
    else{
        cb(null , false);
    }
};
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'uploads')
    },
    filename: (req, file, cb) =>{
        cb(null , new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});

const upload = multer({storage: fileStorage, fileFilter: fileFilter });

module.exports = {
    upload
}