const Order = require('../models/orders');

function orderController() {
  return {
    store(req, res) {
      const { customerId, phone, address } = req.body;

      if (!customerId || !phone || !address) {
        req.flash('error', 'All Fields are Required');
        return res.redirect('/cart');
      }

      const order = new Order({
        items: req.session.cart.items,
        customerId: req.session.user._id,
        phone,
        address,
      });

      order
        .save()
        .then(() => {
          req.flash('success', 'Order Placed Successfully');
          return res.redirect('/orders');
        })
        .catch(err => {
          console.error(err);
          req.flash(
            'error',
            'You can Only make 1 Order at a time, after your first order you can make another...'
          );
          return res.redirect('/cart');
        });
    },

    async index(req, res) {
      try {
        const orders = await Order.find({
          customerId: req.session.user._id,
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
  };
}

module.exports = orderController;
