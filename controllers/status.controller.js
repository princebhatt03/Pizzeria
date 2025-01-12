const Order = require('../models/orders');

function statusController() {
  return {
    async update(req, res) {
      try {
        await Order.updateOne(
          { _id: req.body.orderId },
          { status: req.body.status }
        );
        return res.redirect('/adminOrders');
      } catch (err) {
        console.error('Error updating order status:', err);
        return res.redirect('/adminOrders');
      }
    },
  };
}

module.exports = statusController;
