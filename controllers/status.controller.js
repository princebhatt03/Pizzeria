const Order = require('../models/orders');

function statusController() {
  return {
    async update(req, res) {
      try {
        const { orderId, status } = req.body;

        if (status === 'completed') {
          await Order.findByIdAndDelete(orderId);
        } else {
          await Order.updateOne({ _id: orderId }, { status });
        }

        return res.redirect('/adminOrders');
      } catch (err) {
        console.error('Error updating order status:', err);
        return res.redirect('/adminOrders');
      }
    },
  };
}

module.exports = statusController;
