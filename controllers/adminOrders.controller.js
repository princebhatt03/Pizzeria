const order = require('../models/orders');

function adminOrdersController() {
  return {
    async index(req, res) {
      try {
        const orders = await order
          .find({ status: { $ne: 'completed' } }, null, {
            sort: { createdAt: -1 },
          })
          .populate('customerId', '-password'); // Exclude password field

        // Extract the username from session if logged in
        const username = req.session?.admin?.username;

        // If the request is an AJAX (XHR) request, return JSON
        if (req.xhr) {
          return res.json(orders);
        }

        // Render the 'adminOrder' view with the orders and username
        return res.render('adminOrder', { orders, username });
      } catch (err) {
        console.error('Error fetching admin orders:', err);
        return res.status(500).send('Internal Server Error');
      }
    },
  };
}

module.exports = adminOrdersController;
