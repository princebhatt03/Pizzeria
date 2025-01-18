function cartController() {
  return {
    index(req, res) {
      res.render('customer/cart');
    },

    update(req, res) {
      if (!req.session.cart) {
        req.session.cart = {
          items: {},
          totalQty: 0,
          totalPrice: 0,
        };
      }

      let cart = req.session.cart;

      // Check if the item is already in the cart
      if (!cart.items[req.body._id]) {
        // Add new item to cart
        cart.items[req.body._id] = {
          item: req.body,
          qty: 1,
        };
        cart.totalQty += 1;
        cart.totalPrice += req.body.price;
      } else {
        // Increment quantity and update price
        cart.items[req.body._id].qty += 1;
        cart.totalQty += 1;
        cart.totalPrice += req.body.price;
      }

      // Return the updated cart quantity
      return res.json({ totalQty: cart.totalQty, totalPrice: cart.totalPrice });
    },

    remove(req, res) {
      if (!req.session.cart || !req.session.cart.items[req.body._id]) {
        return res.status(400).json({ error: 'Item not found in cart' });
      }

      let cart = req.session.cart;

      // Get item details
      let item = cart.items[req.body._id];

      // Update cart quantities and price
      cart.totalQty -= item.qty;
      cart.totalPrice -= item.item.price * item.qty;

      // Remove item from cart
      delete cart.items[req.body._id];
      req.flash('success', `${removedItem.item.name} removed from the cart.`);
      res.redirect('/cart');
    },
  };
}

module.exports = cartController;
