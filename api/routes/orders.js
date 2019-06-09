const express = require('express');

const router = express.Router();
const OrdersController = require('../controllers/orders');

router.get('/', OrdersController.ordersGetAll);

router.post('/', OrdersController.ordersCreateOrder);

router.get('/:orderId', OrdersController.ordersGetOrder);

router.delete('/:orderId', OrdersController.ordersDeleteOrder);

module.exports = router;
