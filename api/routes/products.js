/* eslint-disable arrow-body-style */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */

const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const Product = require('../models/product');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/gi, '-') + file.originalname);
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

router.get('/', (req, res) => {
  Product.find()
    .select('name price _id productImage')
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          if (doc.productImage) {
            return {
              name: doc.name,
              price: doc.price,
              productImage: `http://localhost:3000/uploads/${doc.productImage}`,
              _id: doc._id,
              request: {
                type: 'GETs',
                url: `http://localhost:3000/products/${doc._id}`
              }
            };
          }
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            request: {
              type: 'GETs',
              url: `http://localhost:3000/products/${doc._id}`
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
});

router.post('/', upload.single('productImage'), (req, res) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.filename
  });
  product.save()
    .then((result) => {
      res.status(201).json({
        message: 'Created product successfully',
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: 'GET',
            url: `http://localhost:3000/products/${result._id}`
          }
        }
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
});

router.get('/:productId', (req, res) => {
  const id = req.params.productId;
  Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then((doc) => {
      console.log('From database', doc);
      if (doc) {
        if (doc.productImage) {
          res.status(200).json({
            product: doc,
            imageURL: `http://localhost:3000/uploads/${doc.productImage}`
          });
        }
        res.status(200).json({
          product: doc
        });
      }
      else {
        res.status(404).json({ message: 'No valid entry found' });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch('/:productId', (req, res) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: 'Product updated',
        request: {
          type: 'GET',
          url: `http://localhost:3000/products/${id}`
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete('/:productId', (req, res) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(() => {
      res.status(200).json({
        message: 'Product deleted'
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
