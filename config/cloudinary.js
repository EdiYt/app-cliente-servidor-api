const cloudinary = require('cloudinary').v2;

// Configurar Cloudinary con tus credenciales
cloudinary.config({
  cloud_name: 'djczicsj0',
  api_key: '749568152563129',
  api_secret: '_JG_KBElUYDP81WEIdD_SrUdB4M'
});

module.exports = cloudinary;