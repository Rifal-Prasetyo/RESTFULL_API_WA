import multer from 'multer';
// is middleware for handling form multipart-formdata
// RIFAL SANTRI KODING

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./app/storage/public/image");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + "." + file.originalname.split('.').pop());
    }

})
export const upload = multer({
    storage: storage, limits: {
        fileSize: 10240000
    }
});
