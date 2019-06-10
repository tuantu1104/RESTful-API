/* eslint-disable arrow-body-style */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const Product = require('../models/product');

exports.productsGetAll = (req, res) => {
  Product.find()
    .select('name price _id productImage')
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((product) => {
          return {
            product,
            imageURL: product.productImage ? `${req.protocol}://${req.get('host')}/uploads/${product.productImage}` : null,
            request: {
              type: 'GETs',
              url: `${req.protocol}://${req.get('host')}/products/${product._id}`
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
};

exports.productsCreateProduct = (req, res) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file ? req.file.filename : null
  });
  product.save()
    .then((result) => {
      res.status(201).json({
        message: 'Product created successfully',
        createdProduct: result,
        request: {
          type: 'GET',
          url: `http://localhost:3000/products/${result._id}`
        }
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
};

exports.productsGetProduct = (req, res) => {
  const id = req.params.productId;
  Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then((result) => {
      console.log('From database', result);
      if (result) {
        res.status(200).json({
          product: result,
          imageURL: result.productImage ? `http://localhost:3000/uploads/${result.productImage}` : null
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
};

exports.productsEditProduct = (req, res) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'Product updated',
        updated_product: result,
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
};

exports.productsDeleteProduct = (req, res) => {
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
};
