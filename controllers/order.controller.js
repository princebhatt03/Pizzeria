const Order = require('../models/orders');

function orderController() {
  return {
    store(req, res) {
      const { customerId, phone, address } = req.body;

      // Check if all required fields are provided
      if (!customerId || !phone || !address) {
        req.flash('error', 'All fields are required');
        return res.redirect('/cart');
      }

      // Create a new order with the details from the cart
      const order = new Order({
        items: req.session.cart.items,
        customerId: req.session.user._id,
        phone,
        address,
        status: 'pending',
      });

      // Save the order and clear the cart
      order
        .save()
        .then(() => {
          // Clear the cart in the session after order is saved
          req.session.cart = null; // Remove the cart from session

          req.flash('success', 'Order placed successfully');
          return res.redirect('/orders');
        })
        .catch(err => {
          console.error(err);
          req.flash(
            'error',
            'You can only make one order at a time. After completing your first order, you can place another.'
          );
          return res.redirect('/cart');
        });
    },

    // Other controller methods remain the same
    async index(req, res) {
      try {
        const orders = await Order.find({
          customerId: req.session.user._id,
          status: { $ne: 'completed' }, // Only fetch pending orders
        }).sort('-createdAt');

        res.render('orders', {
          orders,
          success: req.flash('success'),
          error: req.flash('error'),
          username: req.session?.user?.username || null,
        });
      } catch (err) {
        console.error(err);
        req.flash('error', 'Could not fetch orders, please try again');
        res.redirect('/');
      }
    },

    async show(req, res) {
      try {
        const order = await Order.findById(req.params.id);
        if (!order) {
          req.flash('success', 'Order Completed Successfully');
          return res.redirect('/rate');
        }

        if (req.session.user._id.toString() === order.customerId.toString()) {
          return res.render('singleOrder', { order });
        }

        req.flash('error', 'You are not authorized to view this order');
        return res.redirect('/');
      } catch (err) {
        console.error('Error fetching order:', err);
        req.flash('error', 'Something went wrong');
        return res.redirect('/');
      }
    },
  };
}

module.exports = orderController;
