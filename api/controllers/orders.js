const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

exports.ordersGetAll = (req, res) => {
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
};

exports.ordersCreateOrder = (req, res) => {
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
};

exports.ordersGetOrder = (req, res) => {
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
};

exports.ordersDeleteOrder = (req, res) => {
  res.status(200).json({
    message: 'Order delete',
    orderId: req.params.orderId
  });
};
