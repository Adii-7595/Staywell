require('dotenv').config();

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
    console.error("Missing Cloudinary credentials in environment variables");
}


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,

}
)

cloudinary.api.ping()
    .then(() => console.log("Cloudinary connection successful"))
    .catch(error => console.error("Cloudinary connection failed:", error));

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'Hostel_Hub_Dev',
      allowedFormats:['png','jpg','jpeg','avif','pdf']
    },
  });



  module.exports = {
    cloudinary,
    storage,
  }