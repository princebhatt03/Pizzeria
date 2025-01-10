const Menu = require('../models/menu');

function homeController() {
  return {
    async index(req, res) {
      // Fetch the menu (assuming 'Menu' is your model to get pizzas)
      const pizzas = await Menu.find();

      // Get flash messages
      const success = req.flash('success');
      const error = req.flash('error');

      // Get the username from session (if available)
      const username = req.session?.user?.username || null;

      // Render the 'index' view and pass necessary data
      return res.render('index', { pizzas, username, success, error });
    },
  };
}

module.exports = homeController;
