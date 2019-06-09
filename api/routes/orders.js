const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res) => {
  Order.find()
    .select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
});

router.post('/', (req, res) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: 'Product not found'
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      });
      return order.save();
    })
    .then((result) => {
      console.log(result);
      res.status(201).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get('/:orderId', (req, res) => {
  Order.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(req.params.orderId) } },
    {
      $lookup: {
        from: 'products',
        localField: 'product',
        foreignField: '_id',
        as: 'orderdetails'
      }
    }
  ])
    .exec()
    .then((order) => {
      res.status(200).json({
        order,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/orders'
        }
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
});

router.delete('/:orderId', (req, res) => {
  res.status(200).json({
    message: 'Order delete',
    orderId: req.params.orderId
  });
});

module.exports = router;
