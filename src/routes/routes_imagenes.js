const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imagen_controller');
const multer = require('multer');
const upload = multer({ dest: 'temp/' });

router.post('/upload', upload.single('image'), imageController.uploadImage);

router.get('/:fileName', imageController.getImage);



module.exports = router;
