/* eslint-disable arrow-body-style */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */

const express = require('express');
const multer = require('multer');
const checkAuth = require('../auth/checkAuth');
const checkAdmin = require('../auth/checkAdmin');
const ProductController = require('../controllers/products');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const imageFileName = new Date().toISOString().replace(/:/gi, '-') + file.originalname;
    cb(null, imageFileName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  }
  else cb(null, false);
};

const upload = multer({ storage, fileFilter });
const router = express.Router();

router.get('/', ProductController.productsGetAll);

router.post('/', checkAdmin, upload.single('productImage'), ProductController.productsCreateProduct);

router.get('/:productId', ProductController.productsGetProduct);

router.patch('/:productId', checkAdmin, ProductController.productsEditProduct);

router.delete('/:productId', checkAdmin, ProductController.productsDeleteProduct);

module.exports = router;
