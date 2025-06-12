const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');

//Access the cloud
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

//route to cloud
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder: "EasyStay_dev",
        allowedFormats: ["png", "jpg", "jpeg"],
    }
})

module.exports = {
    cloudinary,
    storage
}