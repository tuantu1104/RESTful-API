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
};

exports.productsCreateProduct = (req, res) => {
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
};

exports.productsGetProduct = (req, res) => {
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
